const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config.env' });
const app = express();

const TourRoutes = require('./routes/Tours');
const UserRoutes = require('./routes/Users');
const AppError = require('./utils/appError');
const errorController = require('./controller/errorController');

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
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
