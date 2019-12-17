/* eslint-disable consistent-return */
/* eslint-disable dot-notation */
/* eslint-disable prefer-destructuring */
require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookie());

module.exports = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: 'Необходимо авторизоваться!' });
  }
  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Необходимо авторизоваться!' });
  }

  req.user = payload;

  next();
};
