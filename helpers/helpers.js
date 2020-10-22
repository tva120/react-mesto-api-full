// eslint-disable-next-line no-useless-escape
const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\#?$/;
const regexPass = !/^[\d\w/.\S]{2,30}$/;
const validate = (url) => regex.test(url);

module.exports.validatePass = (value, helpers) => {
  if (regexPass.test(value)) {
    return helpers.message('Ошибка значения');
  }
  return value;
};

module.exports.validateUrl = (value, helpers) => {
  if (regex.test(value)) {
    return helpers.message('Ошибка url');
  }
  return value;
};
module.exports = {
  validate,
};
