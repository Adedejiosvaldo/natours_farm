const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const sendEmail = require('../utils/emailHandler');
const crypto = require('crypto');
const signToken = (userId) =>
  jwt.sign({ id: userId._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  user.password = undefined;

  console.log(cookieOptions.expires);
  if (process.env.NODE_ENV === 'prodcution') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'sucess',
    token,
    data: {
      user: user,
    },
  });
};

const signUp = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    roles: req.body.roles,
    passwordChangedAt: Date.now(),
  });

  createSendToken(newUser, 201, res);
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
  //   res.status(200).json({
  //     status: 'success',
  //     token,
  //   });

  createSendToken(200, res);
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
    res.status(200).json({
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

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Get user based on token.
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3 Update changedPasswordAt

  // 4. Log the user in and send jwt

  const token = signToken(user._id);

  res.status(201).json({
    status: 'sucess',
    token,
  });
});

const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // 1. Get User
  const user = await User.findById(req.user.id).select('+password');

  // 2. Check if posted password is correct

  const doPasswordMatch = await user.correctPassword(
    req.body.oldPassword,
    user.password,
  );
  if (!doPasswordMatch) {
    return next(new AppError('Invalid Password', 401));
  }
  // 3. If true, Update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  await user.save();
  // 4.  Log User in
  createSendToken(user, 200, res);
});

module.exports = {
  signUp,
  login,
  protectMiddleWare,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
