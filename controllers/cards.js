/* eslint-disable no-unused-vars */

const Card = require('../models/card');
const Error404 = require('../errors/err404');
const Error401 = require('../errors/err401');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ cards }))
    .catch();
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.cookie('owner', owner).send({ card }))
    .catch((err) => next(new Error401('Введите все данные корректно')));
};


module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.findByIdAndRemove(req.params.cardId)
            .then((cardRemove) => res.send({ remove: cardRemove }))
            .catch(next);
        } else {
          next(new Error404('Это не ваша карта'));
        }
      } else {
        next(new Error404('Карта не найдена'));
      }
    })
    .catch();
};
