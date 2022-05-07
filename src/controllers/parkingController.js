'use strict';
const {
  getAllParkspots,
  addParkspot,
  getParkspotsByUserId,
  deleteParkspotById,
} = require('../models/parkingModel');

const get_all_parkspots = async (req, res) => {
  const parkspots = await getAllParkspots(res);
  res.json({ isLogged: true, userId: res.userId, hasRight: true, parkspots });
};

const get_parkspots_by_user_id = async (req, res) => {
  const parkspots = await getParkspotsByUserId(req, res);
  res.json({ isLogged: true, userId: res.userId, hasRight: true, parkspots });
};

const add_parkspot = async (req, res) => {
  const parkspotNewId = await addParkspot(req, res);
  const newParkspot = req.body;
  newParkspot.id = parkspotNewId;
  res.json({
    isLogged: true,
    userId: req.userId,
    hasRight: true,
    parkspot: newParkspot,
  });
};

const delete_parkspot_by_id = async (req, res) => {
  const isDeleted = await deleteParkspotById(req, res);
  res.json({ isDeleted });
};

module.exports = {
  get_all_parkspots,
  get_parkspots_by_user_id,
  add_parkspot,
  delete_parkspot_by_id,
};
