/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
require('dotenv').config();
const express = require('express');
const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');


const app = express();
app.use(cookie());

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .populate('user')
    .then((users) => res.send({ users }))
    .catch((err) => next({ message: 'Неправильный запрос' }));
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

    .catch((err) => next({ message: 'Введите все данные корректно' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => next({ message: 'Неправильный формат ввода ID' }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('token', token);
      res.status(200).send({ token });
    })
    .catch((err) => next({ message: 'Ввели неправильно логин или пароль' }));
};
