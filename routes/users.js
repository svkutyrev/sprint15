const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUsers, getUser, createUser } = require('../controllers/users');

router.get('/users/:id', getUser);
router.get('/users', getUsers);
router.post('/users', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    avatar: Joi.string().required(),
  }),
}), createUser);


module.exports = router;
