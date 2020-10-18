const users = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  getUsers, getUser, updateProfile, updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);

users.get('/:_id', celebrate({
  body: Joi.object().keys({
    id: Joi.string().hex().required(),
  }),
}), getUser);

users.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

users.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/).required(),
  }),
}), updateAvatar);

users.use(errors());

module.exports = users;
