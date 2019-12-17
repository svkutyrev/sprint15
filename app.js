/* eslint-disable consistent-return */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cards = require('./routes/cards');
const users = require('./routes/users');
const pages = require('./routes/pages');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/MestoDB1', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    about: Joi.string().required().min(2),
    avatar: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

app.use(auth);

app.use((req, res, next) => {
  req.user = {
    _id: req.user._id,
  };
  next();
});

app.use('/', cards);
app.use('/', users);
app.use('/', pages);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode, message } = err;
  if (message === 'Введите все данные корректно') {
    return res.status(401).send({ message: 'Введите все данные корректно' });
  }
  if (message === 'Ввели неправильно логин или пароль') {
    return res.status(401).send({ message: 'Ввели неправильно логин или пароль' });
  }
  if (message === 'Неправильный формат ввода ID') {
    return res.status(404).send({ message: 'Неправильный формат ввода ID' });
  }
  if (message === 'Неправильный запрос') {
    return res.status(404).send({ message: 'Неправильный запрос' });
  }
  if (message === 'неверный формат ввода id') {
    return res.status(404).send({ message: 'неверный формат ввода id' });
  }

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
