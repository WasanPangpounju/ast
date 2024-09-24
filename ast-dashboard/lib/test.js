const mysql = require('mysql2');

// Create a connection to MariaDB
const connection = mysql.createConnection({
  host: 'localhost',   // replace with your MariaDB host
  user: 'fddashboard', // replace with your MariaDB username
  password: 'fd9096390', // replace with your MariaDB password
  database: 'ast' // replace with your MariaDB database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB: ', err);
    return;
  }
  console.log('Connected to MariaDB');
});


// Query the database
connection.query('SELECT * FROM users', (err, results, fields) => {
  if (err) {
    console.error('Error executing query: ', err);
    return;
  }
  console.log('Query Results:', results);
});

connection.end((err) => {
  if (err) {
    console.error('Error ending the connection: ', err);
    return;
  }
  console.log('Connection closed');
});

// Export connection for use in other parts of your application
// module.exports = connection;
