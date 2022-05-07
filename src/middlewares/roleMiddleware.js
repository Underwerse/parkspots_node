'use strict';
const jwt = require('jsonwebtoken');
const { secret } = require('../util/config');

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(403).json({
          isLogged: false,
          message: 'User is not authorized',
        });
      }

      const { role: userRole, id } = jwt.verify(token, secret);
      let hasRole = false;
      console.log('User ID from token: ' + id);
      if (userRole == role) {
        hasRole = true;
        res.userId = id;
      }

      if (!hasRole) {
        return res.status(403).json({
          isLogged: true,
          userId: id,
          hasRight: false,
          message: 'You have no right for this content',
        });
      }
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(403).json({
        isLogged: false,
        message: 'User is not authorized',
      });
    }
  };
};
