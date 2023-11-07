const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });
const app = express();

const TourRoutes = require('./routes/Tours');
const UserRoutes = require('./routes/Users');

//Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/tours', TourRoutes);
app.use('/api/v1/users', UserRoutes);

//not found
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'Fail',
  //     message: `Can't find ${req.originalUrl} on this server`,
  //   });

  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.status = 'fail';

  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
