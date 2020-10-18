const users = require('express').Router();
const {
  getUsers, getUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

users.get('/users', getUsers);
users.get('/users/:_id', getUser);
users.post('/users', createUser);
users.patch('/users/me', updateProfile);
users.patch('/users/me/avatar', updateAvatar);

module.exports = users;
