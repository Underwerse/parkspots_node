'use strict';
const {
  getUsers,
  getUserById,
  getUserByEmail,
  // addUser,
} = require('../models/userModel');

const get_users = async (req, res) => {
  try {
    const users = await getUsers(res);
    res.json(users);
  } catch (error) {
    console.log(`auth error: ${error}`);
  }
};

const get_user_by_email = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email, res);
    res.json(user);
  } catch (error) {
    console.log(`auth error: ${error}`);
  }
};

const get_user_by_id = async (req, res) => {
  try {
    const user = await getUserById(req.params.id, res);
    res.json(user);
  } catch (error) {
    console.log(`auth error: ${error}`);
  }
};

const user_delete = (req, res) => {
  res.send('From this endpoint you can delete user by id', req.params.id);
};

const checkToken = (req, res, next) => {
  //TODO: fix: response always empty object
  console.log('checkToken', req);
  if (!req.user) {
    next(new Error('token not valid'));
  } else {
    res.json({ user: req.user });
  }
};

module.exports = {
  get_users,
  get_user_by_id,
  get_user_by_email,
  user_delete,
  checkToken,
};
