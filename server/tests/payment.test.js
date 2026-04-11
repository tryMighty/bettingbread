const request = require('supertest');
const express = require('express');
const { stripeWebhookHandler } = require('../routes/payment');
const { pool } = require('../db/index');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const discordBot = require('../services/discordBot');

// --- Mocking ---
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn()
    },
    subscriptions: {
      retrieve: jest.fn()
    }
  }));
});

jest.mock('../db/index', () => ({
  pool: {
    connect: jest.fn(),
    query: jest.fn()
  }
}));

jest.mock('../services/discordBot', () => ({
  grantRole: jest.fn(),
  revokeRole: jest.fn()
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

// Setup a minimal app for testing the webhook
const app = express();
// Use raw body for the webhook as in app.js
app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

describe('Stripe Webhook Handler', () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default DB mock
    mockClient = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn()
    };
    pool.connect.mockResolvedValue(mockClient);
    pool.query.mockResolvedValue({ rows: [] });
  });

  test('checkout.session.completed grants role and updates database', async () => {
    const mockSession = {
      id: 'sess_123',
      amount_total: 1000,
      currency: 'usd',
      customer: 'cus_123',
      subscription: 'sub_123',
      metadata: {
        discord_id: '1234567890',
        tier: 'monthly'
      }
    };

    // Mock Stripe signature verification success
    const stripeInstance = require('stripe')();
    stripeInstance.webhooks.constructEvent.mockReturnValue({
      id: 'evt_123',
      type: 'checkout.session.completed',
      data: { object: mockSession }
    });

    const response = await request(app)
      .post('/webhook')
      .set('stripe-signature', 'valid_sig')
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('BEGIN'));
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('memberships'), expect.any(Array));
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('transactions'), expect.any(Array));
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining('COMMIT'));
    expect(discordBot.grantRole).toHaveBeenCalledWith('1234567890');
  });

  test('customer.subscription.deleted revokes role', async () => {
    const mockSubscription = {
      id: 'sub_123'
    };

    const stripeInstance = require('stripe')();
    stripeInstance.webhooks.constructEvent.mockReturnValue({
      id: 'evt_456',
      type: 'customer.subscription.deleted',
      data: { object: mockSubscription }
    });

    // Mock DB finding the user
    pool.query.mockResolvedValueOnce({ 
      rows: [{ discord_id: '1234567890', tier: 'monthly' }] 
    });

    const response = await request(app)
      .post('/webhook')
      .set('stripe-signature', 'valid_sig')
      .send(JSON.stringify({}));

    expect(response.status).toBe(200);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('memberships'), expect.any(Array));
    expect(discordBot.revokeRole).toHaveBeenCalledWith('1234567890');
  });

  test('returns 500 for transient Discord failures to trigger Stripe retry', async () => {
    const mockSession = {
      id: 'sess_error',
      metadata: { discord_id: '1234567890', tier: 'monthly' }
    };

    const stripeInstance = require('stripe')();
    stripeInstance.webhooks.constructEvent.mockReturnValue({
      id: 'evt_error',
      type: 'checkout.session.completed',
      data: { object: mockSession }
    });

    // Mock Discord failure
    const transientError = new Error('Discord timeout');
    transientError.isTransient = true;
    discordBot.grantRole.mockRejectedValue(transientError);

    const response = await request(app)
      .post('/webhook')
      .set('stripe-signature', 'valid_sig')
      .send(JSON.stringify({}));

    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Temporary server error');
  });
});
