const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ExistError = require('../errors/ExistError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const InternalError = require('../errors/InternalError');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешно!' });
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
    }))
    .catch((err) => {
      if (err.name === 'MongoError') {
        throw new ExistError({ message: `Пользователь с email ${req.body.email} уже существует` });
      }
      throw new BadRequestError({ message: `Запрос не может быть выполнен: ${err.message}` });
    })
    .then((user) => {
      res.send({
        data: {
          _id: user._id,
          email: user.email,
          name: user.name ? user.name : undefined,
          avatar: user.avatar ? user.avatar : undefined,
          about: user.about ? user.about : undefined,
        },
      });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotFound'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        throw new NotFoundError({ message: 'Данные не найдены!' });
      }
      throw new InternalError({ message: 'На сервере произошла ошибка!' });
    });
};
