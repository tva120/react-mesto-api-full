module.exports = {
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  rules: { 'no-underscore-dangle': ['error', { allow: ['_id'] }] },
};
