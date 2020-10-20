const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users.js');
const cardRouter = require('./routes/cards.js');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3001 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(requestLogger);
const allowedCors = [
  'https://tvaa.students.nomoreparties.xyz',
  'http://tvaa.students.nomoreparties.xyz',
  'https://www.tvaa.students.nomoreparties.xyz',
  'http://www.tvaa.students.nomoreparties.xyz',
  'https://api.tvaa.students.nomoreparties.xyz',
  'http://api.tvaa.students.nomoreparties.xyz',
  'https://api.www.tvaa.students.nomoreparties.xyz',
  'http://api.www.tvaa.students.nomoreparties.xyz',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost',
  undefined,
];

const corsOptions = {
  origin(origin, callback) {
    if (allowedCors.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Ошибка CORS ${origin}`));
    }
  },
};
app.use(cors(corsOptions));

app.options('*', cors({
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credential: true,
  optionsSuccessStatus: 204,
}));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6).max(30),
  }),
}), createUser);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errors());
app.use(errorLogger);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Внутренняя ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening gently port #${PORT}`);
});
