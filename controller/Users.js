const fs = require('fs');
const User = require('../model/User');
const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne } = require('./handlerControllers');

const UsersData = JSON.parse(fs.readFileSync('./dev-data/data/users.json'));

const filteredObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select('-password');

  if (!users) {
    return next(new AppError('No user found', 404));
  }

  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

const updateMe = catchAsyncErrors(async (req, res, next) => {
  // 1- Create error if user tries to update Password (POST PASSWORD DATA)
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('You can only update email', 400));
  }

  // 2. Update user document
  const filteredBody = filteredObject(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsyncErrors(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getAUser = async (req, res) => {
  const { id } = req.params;

  //   console.log(id);
  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      staus: 'Error',
      data: {
        message: 'ID does not exist',
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

// Only for administrators

// Do Not Attempt to changePasswordWithThis
const updateUser = updateOne(User); // Use Auth controller to changePasssword
const deleteUser = deleteOne(User);

module.exports = {
  getAUser,
  getAllUsers,
  updateUser,
  deleteUser,

  updateMe,
  deleteMe,
};
