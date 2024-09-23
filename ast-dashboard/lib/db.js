// lib/db.js
import mariadb from 'mariadb';

// Create a connection pool
// const pool = mariadb.createPool({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: process.env.DATABASE_PORT,
//   connectionLimit: 5,
// });
const pool = mariadb.createPool({
  host: "localhost",
  user: "fddashboard",
  password: "fd9096390",
  database: "ast",
  port: 3306,
  connectionLimit: 5,
});

// Function to query the database
export async function query(sql, values) {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(sql, values);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (conn) conn.release(); // Ensure the connection is released
  }
}
