const User = require('../model/User');
const catchAsyncErrors = require('../utils/catchAsync');
const signUp = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
    },
  });
});

module.exports = { signUp };
