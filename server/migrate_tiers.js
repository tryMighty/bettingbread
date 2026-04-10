const { pool } = require('./db/index');
const logger = require('./utils/logger');

async function migrateTiers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    logger.info('Starting database migration: pro_monthly -> monthly');

    // 1. Drop existing constraints if they exist
    await client.query('ALTER TABLE memberships DROP CONSTRAINT IF EXISTS memberships_tier_check');
    await client.query('ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_tier_check');
    await client.query('ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_event_type_check');

    // 2. Update data mapping
    const memberUpdate = await client.query("UPDATE memberships SET tier = 'monthly' WHERE tier = 'pro_monthly'");
    const auditUpdate = await client.query("UPDATE audit_logs SET tier = 'monthly' WHERE tier = 'pro_monthly'");
    const transUpdate = await client.query("UPDATE transactions SET tier = 'monthly' WHERE tier = 'pro_monthly'");

    logger.info('Updated records', { 
      memberships: memberUpdate.rowCount, 
      audit_logs: auditUpdate.rowCount,
      transactions: transUpdate.rowCount
    });

    // 3. Add new constraints
    await client.query("ALTER TABLE memberships ADD CONSTRAINT memberships_tier_check CHECK (tier IN ('free_trial', 'weekly', 'monthly', 'lifetime'))");
    await client.query("ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_event_type_check CHECK (event_type IN ('signup', 'login', 'logout', 'free_trial', 'purchase', 'expiration', 'revoked', 'admin_action', 'role_grant', 'role_revoke'))");

    await client.query('COMMIT');
    logger.info('Database migration completed successfully');
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Migration failed', { error: err.message });
    process.exit(1);
  } finally {
    client.release();
  }
}

migrateTiers();
