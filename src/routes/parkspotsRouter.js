'use strict';
const Router = require('express');
const multer = require('multer');
const router = new Router();
const {
  get_all_parkspots,
  add_parkspot,
  get_parkspots_by_user_id,
  delete_parkspot_by_id,
} = require('../controllers/parkingController');
const checkRightsMiddleware = require('../middlewares/checkRightsMiddleware');
const { add_image_by_parkspot_id } = require('../controllers/imageController');

const fileFilter = (req, file, cb) => {
  const allowedMimetypes = ['image/png', 'image/jpeg', 'image/gif'];
  if (allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './ui/uploads');
  },
  filename: function (req, file, cb) {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, file.originalname + '-' + Date.now() + '.' + extension);
  },
});
const upload = multer({ storage: storage, fileFilter });

router.get('/', get_all_parkspots);
router.get('/:id', checkRightsMiddleware(), get_parkspots_by_user_id);
router.post('/add', checkRightsMiddleware(), add_parkspot);
router.post(
  '/add/image',
  upload.single('parkspotImage'),
  add_image_by_parkspot_id
);
router.delete('/delete/:id', checkRightsMiddleware(), delete_parkspot_by_id);

module.exports = router;
