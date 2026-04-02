const cron = require('node-cron');
const { pool } = require('../db/index');
const { revokeRole } = require('./discordBot');

/**
 * Initializes background tasks for membership maintenance.
 */
function initCronJobs() {
  // Run every minute to accurately catch short trial expirations
  cron.schedule('* * * * *', async () => {
    // console.log('Running background check for expired memberships...');
    try {
      // Find active memberships that have passed their expiry date
      const expiredRes = await pool.query(`
        SELECT discord_id, tier 
        FROM memberships 
        WHERE status = 'active' 
        AND expiry_date < NOW()
        AND tier != 'lifetime'
      `);

      if (expiredRes.rows.length === 0) {
        return;
      }

      for (const row of expiredRes.rows) {
        const { discord_id, tier } = row;
        
        console.log(`Processing expiry for ${discord_id} (Tier: ${tier})...`);

        // 1. Revoke Discord Role
        await revokeRole(discord_id);

        // 2. Update Database status
        await pool.query(`
          UPDATE memberships 
          SET status = 'expired', updated_at = NOW() 
          WHERE discord_id = $1
        `, [discord_id]);

        // 3. Log Expiration Audit
        await pool.query(`
          INSERT INTO audit_logs (discord_id, event_type, tier, description)
          VALUES ($1, $2, $3, $4)
        `, [discord_id, 'expiration', tier, 'Membership time expired and role automatically revoked']);

        console.log(`Successfully revoked role and expired membership for ${discord_id}`);
      }
    } catch (err) {
      console.error('Error in membership expiry cron job:', err);
    }
  });

  console.log('Membership expiry cron job initialized (hourly).');
}

module.exports = { initCronJobs };
