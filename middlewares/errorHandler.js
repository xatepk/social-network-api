const { CelebrateError } = require('celebrate');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const { status = 500, message } = err;
  if (err.message && err.message.includes('Cast')) {
    return res.status(400).send({ message: err.message });
  }

  if (err instanceof CelebrateError) {
    return res.status(400).send(err.details.get('body'));
  }
  return res
    .status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
};

module.exports = errorHandler;
