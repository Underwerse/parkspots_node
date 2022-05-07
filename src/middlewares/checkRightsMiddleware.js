'use strict';
const jwt = require('jsonwebtoken');
const { secret } = require('../util/config');

module.exports = function () {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res
          .status(403)
          .json({ isLogged: false, message: 'User is not authorized' });
      }

      const { role: userRole, id } = jwt.verify(token, secret);
      let hasRole = false;

      if (req.method === 'DELETE') {
        req.params.userId = id;
        req.params.userRole = userRole;
        next();
      } else if (req.method === 'GET') {
        if (userRole == 99 || id == req.params.id) {
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
      } else if (req.method == 'POST') {
        req.userId = id;
        hasRole = true;
        next();
      }
    } catch (e) {
      console.log(e.message);
      return res
        .status(403)
        .json({ isLogged: false, message: 'User is not authorized' });
    }
  };
};
