const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!authorization) {
    throw new AuthorizationError('Необходима авторизация');
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (e) {
    throw new AuthorizationError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
