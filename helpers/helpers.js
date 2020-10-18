// eslint-disable-next-line no-useless-escape
const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?\#?$/;
const validate = (url) => regex.test(url);

module.exports = {
  validate,
};
