// Connection to MySQL. Use it anywhere with:  const db = require('./db');
const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
  dateStrings: true, // return dates as text "2026-11-02 10:30:00"
});

module.exports = db;
