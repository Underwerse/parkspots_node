'use strict';
const pool = require('../util/db');
const promisePool = pool.promise();

const getAllImagesByParkspotId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await promisePool.query(
      'SELECT * FROM images WHERE parkspotId = ?',
      [id]
    );
    return rows;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

const addImageByParkspotId = async (req, res) => {
  try {
    const { parkspotId } = req.body;
    const filename = req.file.filename;
    const [rows] = await promisePool.query(
      'INSERT INTO images (filename, parkspotId) VALUES (?, ?)',
      [filename, parkspotId]
    );
    return rows.insertId;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

const deleteImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await promisePool.query('DELETE FROM images WHERE id = ?', [
      id,
    ]);
    return rows.affectedRows === 1;
  } catch (e) {
    console.error('error', e.message);
    res.status(500).json({ message: e.message });
  }
};

module.exports = {
  getAllImagesByParkspotId,
  addImageByParkspotId,
  deleteImageById,
};
