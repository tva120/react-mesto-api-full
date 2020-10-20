const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { validate } = require('../helpers/helpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
    validate: {
      validator: (url) => validate(url),
      message: (props) => `${props.value} - некорректная ссылка`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Не заполнен e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Некорректно заполнена почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Некорректно заполнена почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
