import jsonwebtoken from 'jsonwebtoken';
import config from '../config';

/**
 * 
 * @param {Object} req
 * @param {Object} res 
 * @param {Function} next 
 */

exports.authorization = (req, res, next) => {
  'use strict';

  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({
      message: 'Token header is not provided',
    });
  }
  jsonwebtoken.verify(token, config.jwtSecretKey, (err, decoded) => {
    if (!err) {
      req.user = decoded;
      next();
    } else {
      return res.status(401).json({
        message: 'Invalid auth',
      });
    }
  });
};

/**
 * 
 * @param {Object} user 
 * @param {String} user.username
 * @description user parameter contains
 */

const signToken = (user) => {
  'use strict';

  return jsonwebtoken.sign(user, config.jwtSecretKey, {
    expiresIn: config.tokenExpiry,
  });
};

/**
 * 
 * @param {Object} req 
 * @param {Object} req.body
 * @param {String} req.body.username
 * @param {String} req.body.password
 * @param {Object} res 
 */

exports.login = (req, res) => {
  'use strict';

  const { username, password } = req.body;

  if (!username) {
    return res.status(400).json({
      message: 'Username is required',
    });
  }

  if (!password) {
    return res.status(400).json({
      message: 'Password is required',
    });
  }

  if (username === 'unknown') {
    return res.status(401).json({
      message: `Unauthorized access to user ${username}`,
    });
  }

  const token = signToken({ username });
  const data = Object.assign({}, { username }, { token });

  return res.status(200).json({
    message: 'Login successfully',
    data,
  });
};
