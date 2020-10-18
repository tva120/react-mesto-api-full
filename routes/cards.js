const cards = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);

cards.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^((http|https):\/\/)(www\.)?([a-zA-z0-9.-]+)\.([a-zA-z]+)([a-zA-z0-9%$?/.-]+)?(#)?$/),
  }),
}), createCard);

cards.delete('/:_id', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteCard);

cards.put('/:_id/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), likeCard);

cards.delete('/:_id/likes', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
}), dislikeCard);

module.exports = cards;
