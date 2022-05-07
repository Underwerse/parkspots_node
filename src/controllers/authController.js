'use strict';
const { getUserByEmail, addUser } = require('../models/userModel');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('../util/config');

const generateAccessToken = (id, role) => {
  const payload = {
    id,
    role,
  };

  return jwt.sign(payload, secret, {
    expiresIn: '24h',
  });
};

class authControler {
  async registration(req, res) {
    try {
      const candidate = await getUserByEmail(req.body.email, res);
      if (candidate) {
        return res.status(400).json({
          message: 'User already exists',
          isExisted: true,
        });
        // TODO: add redirect to /auth/login route page
      }

      const errors = validationResult(req).errors;
      if (!errors.length) {
        const id = await addUser(req);
        const newUser = {
          ...req.body,
          id,
        };
        delete newUser.password;
        delete newUser.passwordConfirmation;
        return res.status(201).json({
          message: 'User has been registered',
          user: newUser,
          isExisted: false,
        });
      } else {
        console.log(errors);
        res.status(400).json({
          message: 'Validation errors',
          errors,
        });
      }
    } catch (error) {
      console.log(`auth error: ${error}`);
      res.status(400).json({
        message: 'Registration error',
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await getUserByEmail(email, res);
      if (!user) {
        // TODO: add redirect to /auth/registration route page
        return res.status(400).json({
          isLogged: false,
          message: `user with email '${email}' not found in the DB`,
        });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({
          isLogged: false,
          message: 'password incorrect',
        });
      }

      const token = generateAccessToken(user.id, user.role);
      return res.json({
        isLogged: true,
        token,
        user,
      });
    } catch (error) {
      console.log(`auth error: ${error.message}`);
      res.status(400).json({
        isLogged: false,
        message: 'Login error',
      });
    }
  }
}

module.exports = new authControler();
