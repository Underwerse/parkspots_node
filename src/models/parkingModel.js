'use strict';
const pool = require('../util/db');
const promisePool = pool.promise();

const getAllParkspots = async (res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM parkspots');
    return rows;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

const getParkspotsByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await promisePool.query(
      'SELECT * FROM parkspots WHERE userId = ?',
      [id]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

const addParkspot = async (req, res) => {
  try {
    const { lat, lng, address, duration, parkqty, electricqty } = req.body;
    const userId = req.userId;
    const [rows] = await promisePool.query(
      'INSERT INTO parkspots (lat, lng, address, duration, parkqty, electricqty, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [lat, lng, address, duration, parkqty, electricqty, userId]
    );
    return rows.insertId;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

const deleteParkspotById = async (req, res) => {
  try {
    const { id, userId, userRole } = req.params;
    let [rows] = [];
    if (userRole == 99) {
      [rows] = await promisePool.query('DELETE FROM parkspots WHERE id = ?', [
        id,
      ]);
    } else {
      [rows] = await promisePool.query(
        'DELETE FROM parkspots WHERE id = ? AND userId = ?',
        [id, userId]
      );
    }
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getAllParkspots,
  getParkspotsByUserId,
  addParkspot,
  deleteParkspotById,
};
