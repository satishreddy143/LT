const mysql = require('mysql2');
require('dotenv').config();

// Create a pool or connection using the promise-based API
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise(); // Use promise-based API for queries

// Test the connection using a simple query
db.query('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => {
        console.log('MySQL connected, test query result:', rows);
    })
    .catch((err) => {
        console.error('Database connection error:', err);
        process.exit(1); // Exit process if database connection fails
    });

module.exports = db;
