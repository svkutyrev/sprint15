
const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getCards, createCard, deleteCard } = require('../controllers/cards');

cards.get('/cards', getCards);
cards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    link: Joi.string().required(),
  }),
}), createCard);
cards.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

module.exports = cards;
