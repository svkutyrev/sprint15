/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const Error401 = require('../errors/err401');
const conf = require('../config');

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: 'Необходимо авторизоваться!' });
  }
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : conf);
  } catch (err) {
    return next(new Error401('Необходимо авторизоваться'));
  }

  req.user = { _id: payload._id };


  next();
};
