'use strict';
const mysql = require('mysql2');
require('dotenv').config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
let db = '';

if (process.env.NODE_ENV === 'test') {
  db = process.env.DB_NAME_TEST;
} else {
  db = process.env.DB_NAME;
}

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: db,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
