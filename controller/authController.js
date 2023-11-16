const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (userId) =>
  jwt.sign({ id: userId._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY_DATE,
  });

const signUp = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // C
  if (!email || !password) {
    return next(new AppError('No email or password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

const protectMiddleWare = catchAsyncErrors(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Kindly login to get access.', 401),
    );
  }

  next();
});

module.exports = { signUp, login, protectMiddleWare };
