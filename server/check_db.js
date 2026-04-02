const { pool } = require('./db/index');
const fs = require('fs');

async function checkSessionTable() {
  try {
    const res = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'session'
      );
    `);
    console.log("Does session table exist?", res.rows[0].exists);
    const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
    console.log("Tables in public schema:", tables.rows.map(t => t.table_name));
    process.exit(0);
  } catch(e) {
    console.error("Error connecting to DB:", e);
    process.exit(1);
  }
}

checkSessionTable();
