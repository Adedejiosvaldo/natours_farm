const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
dotenv.config({ path: './config.env' });
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();
const TourRoutes = require('./routes/Tours');
const UserRoutes = require('./routes/Users');
const AppError = require('./utils/appError');
const errorController = require('./controller/errorController');

//Middlewares

//  Set Security HTTP Headers
app.use(helmet());

// Development logging
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

// Data Sanitization against NoSQL query Injection
app.use(mongoSanitize());

// Data Sanitization against XSS - clean user input from malicious html code
app.use(xss());

// Prevent Parameter Polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'sort',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
    ],
  }),
);

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
