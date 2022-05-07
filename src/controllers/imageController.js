'use strict';
const { makeThumbnail } = require('../util/resize');
const {
  getAllImagesByParkspotId,
  addImageByParkspotId,
  deleteImageById,
} = require('../models/imageModel');

const get_all_images_by_parkspot_id = async (req, res) => {
  const images = await getAllImagesByParkspotId(req, res);
  res.json({
    images,
  });
};

const add_image_by_parkspot_id = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: `Choose your image file`,
    });
  }
  await makeThumbnail(req.file.path, req.file.filename);
  const imageNewId = await addImageByParkspotId(req, res);
  res.json({
    imageNewId,
  });
};

const delete_image_by_id = async (req, res) => {
  console.log('Parkspot id to be deleted: ', req.params.id);
  console.log('User, who wants to delete, id: ', req.params.userId);
  console.log('User role: ', req.params.userRole);
  const isDeleted = await deleteImageById(req, res);
  res.json({ isDeleted });
};

module.exports = {
  get_all_images_by_parkspot_id,
  add_image_by_parkspot_id,
  delete_image_by_id,
};
