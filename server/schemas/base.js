const { z } = require('zod');

/**
 * Base validation schemas for common fields
 */

const discordIdSchema = z.string()
  .min(17, 'Discord ID must be at least 17 characters')
  .max(21, 'Discord ID cannot exceed 21 characters')
  .regex(/^\d+$/, 'Discord ID must contain only digits');

const tierSchema = z.enum(['weekly', 'monthly', 'lifetime']);

module.exports = {
  discordIdSchema,
  tierSchema
};
