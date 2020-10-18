const mongoose = require('mongoose');
const { validate } = require('../helpers/helpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (url) => validate(url),
      message: (props) => `${props.value} - некорректная ссылка`,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
