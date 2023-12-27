const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
dotenv.config({ path: './config.env' });
const app = express();

const TourRoutes = require('./routes/Tours');
const UserRoutes = require('./routes/Users');
const AppError = require('./utils/appError');
const errorController = require('./controller/errorController');
const rateLimiter = require('express-rate-limit');

//Middlewares
//  Set Security HTTP Headers
app.use(helmet());
// Development logginf
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Limit request from same IP
const limiter = rateLimiter({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please Try again in an hour',
});
app.use('/api', limiter);

// Body Parser - Reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Serving Static Files
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/tours', TourRoutes);
app.use('/api/v1/users', UserRoutes);

//not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
