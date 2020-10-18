const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные!' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('NotFound'))
    .then((cards) => res.send(cards))
    .catch((err) => {
      if (err.name === 'NotFound') {
        res.status(404).send({ message: 'Данные не найдены!' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Данные не найдены!' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Данные не найдены!' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params._id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new Error('NotFound'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Данные не найдены!' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка!' });
    });
};
