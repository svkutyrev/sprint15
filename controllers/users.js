/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Error404 = require('../errors/err404');
const Error401 = require('../errors/err401');
const Error403 = require('../errors/err401');
const conf = require('../config');

const { NODE_ENV, JWT_SECRET } = process.env;


const app = express();
app.use(cookie());

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .populate('user')
    .then((users) => res.send({ users }))
    .catch((err) => next(new Error404('Неправильный запрос')));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then(({
      name,
      about,
      avatar,
      email,
    }) => res.send({
      name,
      about,
      avatar,
      email,
    }))

    .catch((err) => next(new Error403('Неверно ввели данные')));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new Error404('Нет пользователя с таким id');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => next(new Error404('Нет пользователя с таким id')));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : conf, { expiresIn: '7d' });
      res.cookie('token', token);
      res.status(200).send({ token });
    })
    .catch((err) => next(new Error401('Ввели неправильно логин или пароль')));
};
