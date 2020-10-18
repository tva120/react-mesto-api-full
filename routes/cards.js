const cards = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getCards);
cards.post('/cards', createCard);
cards.delete('/cards/:_id', deleteCard);
cards.put('/cards/:_id/likes', likeCard);
cards.delete('/cards/:_id/likes', dislikeCard);

module.exports = cards;
