const { pool } = require('./db/index');

async function checkCols() {
  const res = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'memberships';
  `);
  console.log(res.rows);
  process.exit();
}
checkCols();
