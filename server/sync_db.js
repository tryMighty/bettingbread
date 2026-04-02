const { pool } = require('./db/index');
const fs = require('fs');
const path = require('path');

async function syncSchema() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'db', 'unified_schema.sql'), 'utf-8');
    await pool.query(sql);
    console.log("Successfully synchronized the entire database schema!");
    process.exit(0);
  } catch(e) {
    console.error("Failed to sync schema:", e);
    process.exit(1);
  }
}

syncSchema();
