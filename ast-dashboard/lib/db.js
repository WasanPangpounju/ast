// src/lib/db.js
import mysql from 'mysql2/promise';


// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306,
  connectionLimit: 10,  // Limit of concurrent connections
  acquireTimeout: 30000 // 30 seconds timeout (default is 10 seconds)  
});

// A helper function to query the database
export async function query(sql, values) {
  const [results] = await pool.query(sql, values);
  return results;
}
