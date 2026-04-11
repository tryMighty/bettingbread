const { z } = require('zod');
const logger = require('./logger');

/**
 * Schema for environment variable validation.
 * Ensures the server starts with necessary configuration for Stripe and Discord.
 */
const envSchema = z.object({
  // Server Config
  PORT: z.string().default('5000'),
  CLIENT_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Stripe Config
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  STRIPE_PRICE_WEEKLY: z.string().regex(/^(price|prod)_/),
  STRIPE_PRICE_PRO_MONTHLY: z.string().regex(/^(price|prod)_/),
  STRIPE_PRICE_LIFETIME: z.string().regex(/^(price|prod)_/),

  // Discord Config
  DISCORD_BOT_TOKEN: z.string().min(10),
  DISCORD_GUILD_ID: z.string().regex(/^\d+$/),
  DISCORD_CLIENT_ID: z.string().regex(/^\d+$/),
  DISCORD_ROLE_BREAD_BRO: z.string().regex(/^\d+$/),
});

/**
 * Validates process.env against the schema.
 * Logs errors and exits if validation fails to prevent broken runtime.
 */
function validateConfig() {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const missingKeys = result.error.issues.map(issue => issue.path.join('.')).join(', ');
    logger.error('Critical Configuration Error: Missing or invalid environment variables: %s', missingKeys);
    console.error('\x1b[31m%s\x1b[0m', `CRITICAL CONFIG ERROR: Missing or invalid keys: ${missingKeys}`);
    
    // In production, we exit. In development, we just warn.
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    logger.info('System configuration validated.');
  }
}

module.exports = { validateConfig };
