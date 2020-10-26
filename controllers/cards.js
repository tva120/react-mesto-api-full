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
    .orFail(new NotFoundError('NotFound'))
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.deleteCard = (req, res, next) => {
  const currentOwner = req.user._id;
  Card.findById(req.params._id)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Данные не найдены!');
      }
      if (card.owner.toString() === currentOwner) {
        Card.findByIdAndRemove(req.params._id)
          .then((item) => {
            if (!item) {
              throw new NotFoundError(`Kарточка ${req.params._id} не найдена`);
            }
            res.send(card);
          });
      } else {
        throw new RightsError('Нет прав');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные!'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Данные не найдены!'));
      } else if (err.name === 'Error') {
        next(new BadRequestError(err.message));
      } else if (err.name === 'TypeError') {
        next(new BadRequestError(err.message));
      } else {
        next(new InternalError('На сервере произошла ошибка!'));
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('NotFound'))
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Данные не найдены!');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные!'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Данные не найдены!'));
      } else if (err.name === 'Error') {
        next(new NotFoundError('Данные не найдены!'));
      } else {
        next(new InternalError('На сервере произошла ошибка!'));
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new NotFoundError('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные!'));
      } else if (err.name === 'NotFound') {
        next(new NotFoundError('Данные не найдены!'));
      } else if (err.name === 'Error') {
        next(new NotFoundError('Данные не найдены!'));
      } else {
        next(new InternalError('На сервере произошла ошибка!'));
      }
    });
};
