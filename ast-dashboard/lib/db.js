// lib/db.js
import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306,
  connectionLimit: 10,  // Increase this value
  acquireTimeout: 30000 // Increase timeout (optional)
});

export async function query(sql, params) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();  // Always release the connection back to the pool
  }
}
