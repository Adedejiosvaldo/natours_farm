const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/emailHandler');

const signToken = (userId) =>
  jwt.sign({ id: userId._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signUp = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    roles: req.body.roles,
    passwordChangedAt: Date.now(),
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

  // 2) Verification of Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //   3). Check if user still exist
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to the token no longer exist', 401),
    );
  }
  //   4) Check  if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User Recently Changed Password,PLease Login again', 401),
    );
  }
  //   Grant access to the protected route
  req.user = currentUser;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return next(
        new AppError(
          'You do not have permission to perfom this operation',
          403,
        ),
      );
    }
    next();
  };
};

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // 1) Get the user based on the email Posted
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user Found', 404));
  }
  // 2) Generate Random reset Token
  const resetToken = user.createPasswordResetToken();

  // Saving it
  await user.save({ validateBeforeSave: false });
  // 3) Send it to the user email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a request with your new password and confirm it to : ${resetURL}. \n If you didnt forget your password. Ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset Token (Valid for 10 min)',
      message,
    });
    console.log('Here');
    res
      .status(200)
      .json({
        status: 'success',
        message: 'Token Send to email- Kindly check your email',
      });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending email', 500));
  }
});
const resetPassword = catchAsyncErrors(async (req, res, next) => {});
module.exports = {
  signUp,
  login,
  protectMiddleWare,
  restrictTo,
  forgotPassword,
  resetPassword,
};
