const mysql = require('mysql2');

// Create a connection to MariaDB
const connection = mysql.createConnection({
  host: 'localhost',   // replace with your MariaDB host
  user: 'fddashboard', // replace with your MariaDB username
  password: 'fd9096390', // replace with your MariaDB password
  database: 'ast', // replace with your MariaDB database name
  port: 3306             // Default MariaDB/MySQL port
});
// Error handling during connection
connection.connect((err) => {
  if (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error('Connection refused by the server. Check if the server is running and accessible.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Access denied. Please check your username and password.');
    } else if (err.code === 'ENOTFOUND') {
      console.error('Unable to find the database server. Verify the host.');
    } else {
      console.error('Connection error: ', err);
    }
    return;
  }
  console.log('Connected to MariaDB');
});