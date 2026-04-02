const { pool } = require('./db/index');

async function debugSession() {
  try {
    const profiles = await pool.query('SELECT * FROM profiles');
    console.log("Profiles count:", profiles.rows.length);
    console.log("Profiles:", profiles.rows);

    const sessions = await pool.query('SELECT * FROM session');
    console.log("Sessions count:", sessions.rows.length);
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
debugSession();
