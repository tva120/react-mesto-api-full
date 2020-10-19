const Card = require('../models/card');
const RightsError = require('../errors/RightsError');
const NotFoundError = require('../errors/NotFoundError');
const InternalError = require('../errors/InternalError');
const BadRequestError = require('../errors/BadRequestError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError({ message: 'Некорректные данные!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('NotFound'))
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.deleteCard = (req, res) => {
  const currentOwner = req.user._id;
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (card.owner !== currentOwner) {
        throw new RightsError({ message: 'Нет прав' });
      }
      if (!card) {
        throw new NotFoundError({ message: `Kарточка ${req.params.id} не найдена` });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные!' });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      } else {
        throw new InternalError({ message: 'На сервере произошла ошибка!' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'CastError') {
        throw new BadRequestError({ message: 'Переданы некорректные данные!' });
      } else if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      } else {
        throw new InternalError({ message: 'На сервере произошла ошибка!' });
      }
    });
};
