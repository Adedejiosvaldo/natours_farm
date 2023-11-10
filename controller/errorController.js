// eslint-disable-next-line import/extensions
const AppError = require('../utils/appError.js');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational Errors - Trusted error - send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //   Unknown error : Do not leak errors
  else {
    //   1) Log errors
    console.error('Error', err);
    // 2) Send generic errors
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};
// };

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  //We want to specify the error messages to get
  // when working in the two env
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log('object');
    //This was the line that was giving me issues
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    // console.log(error);
    sendErrorProd(error, res);
  }
};
