'use strict';
const Router = require('express');
const router = new Router();
const {
  get_all_images_by_parkspot_id,
} = require('../controllers/imageController');

router.get('/:id', get_all_images_by_parkspot_id);

module.exports = router;
