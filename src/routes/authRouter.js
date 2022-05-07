'use strict';
const Router = require('express');
const router = new Router();
const { registration, login } = require('../controllers/authController');
const { get_users, get_user_by_id } = require('../controllers/userController');
const { body, check } = require('express-validator');
const checkRightsMiddleware = require('../middlewares/checkRightsMiddleware');

router.post(
  '/registration',
  body('name')
    .trim()
    .isLength({
      min: 2,
      max: 12,
    })
    .withMessage('must be at least 2 chars long'),
  body('lastname')
    .trim()
    .isLength({
      min: 2,
      max: 15,
    })
    .withMessage('must be at least 2 chars long'),
  body('email')
    .notEmpty()
    .withMessage('must not be empty')
    .isLength({
      min: 6,
      max: 30,
    })
    .isEmail()
    .normalizeEmail()
    .withMessage('must be email with 6-30 chars length'),
  body('password')
    .trim()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage('must be at least 4 chars long, without spaces'),
  check('passwordConfirmation')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation is incorrect');
      }
      return true;
    }),
  registration
);
router.post(
  '/login',
  body('email')
    .notEmpty()
    .withMessage('must not be empty')
    .isEmail()
    .normalizeEmail()
    .withMessage('must be email'),
  body('password')
    .trim()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage('must be at least 4 chars long, without spaces'),
  login
);
router.get('/users', checkRightsMiddleware(), get_users);
router.get('/user/:id', checkRightsMiddleware(), get_user_by_id);

module.exports = router;
