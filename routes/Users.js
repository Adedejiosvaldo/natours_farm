const express = require('express');
const {
  getAllUsers,
  createUser,
  getAUser,
  updateUser,
  deleteUser,
} = require('../controller/Users');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} = require('../controller/authController');

const router = express.Router();

// Signup route
router.post('/signup', signUp);
router.post('/login', login);

// Forgot and Reset Functionalities route
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

//User ROute

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
