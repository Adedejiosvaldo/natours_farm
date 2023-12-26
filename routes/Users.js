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
  updatePassword,
  protectMiddleWare,
} = require('../controller/authController');

const router = express.Router();

// Signup route
router.post('/signup', signUp);
router.post('/login', login);

// Forgot and Reset Functionalities route
router.post('/forgotPassword', forgotPassword);
router.patch('/updatePassword', protectMiddleWare, updatePassword);
router.patch('/resetPassword/:token', resetPassword);

//User ROute

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
