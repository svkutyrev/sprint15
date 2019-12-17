/* eslint-disable no-unused-vars */
const NotFoundError = require('../errors/not-found-err');
const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ cards }))
    .catch((err) => next({ message: 'Неправильный запрос' }));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.cookie('owner', owner).send({ card }))
    .catch((err) => next({ message: 'Введите все данные корректно' }));
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
          throw new NotFoundError('Это не ваша карта');
        }
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};
