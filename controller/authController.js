const User = require('../model/User');
const catchAsyncErrors = require('../utils/catchAsync');
const signUp = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
    },
  });
});

module.exports = { signUp };
