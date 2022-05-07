'use strict';
const pool = require('../util/db');
const bcrypt = require('bcryptjs');
const promisePool = pool.promise();

const getUsers = async (res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT id, name, lastname, email, role, theme_color, timestamp FROM users'
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

const getUserById = async (id, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT id, name, lastname, email, role, theme_color FROM users WHERE id = ?',
      [id]
    );
    console.log('user: ', rows[0]);
    return rows[0] || {};
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

const getUserByEmail = async (email, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

const addUser = async (req, res) => {
  try {
    const { name, lastname, password, email, role, theme_color } = req.body;
    const hashPassword = bcrypt.hashSync(password, 7);
    const [rows] = await promisePool.query(
      'INSERT INTO users (name, lastname, email, password, role, theme_color) VALUES (?, ?, ?, ?, ?, ?)',
      [name, lastname, email, hashPassword, role, theme_color]
    );
    return rows.insertId;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'DELETE FROM users WHERE email = ?',
      [req.user.email]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({
      message: e.message,
    });
  }
};

const truncateUsers = async () => {
  try {
    const [rows] = await promisePool.query('TRUNCATE TABLE USERS');
    return rows;
  } catch (e) {
    console.error('error', e.message);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  addUser,
  deleteUser,
  truncateUsers,
};
