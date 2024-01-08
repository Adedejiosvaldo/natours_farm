const express = require('express');
const {
  getAllUsers,
  //   createUser,
  getAUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../controller/Users');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');

const router = express.Router();

// Signup route
router.post('/signup', signUp);
router.post('/login', login);
// Forgot and Reset Functionalities route
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware - User only route
router.use(protectMiddleWare);
router.route('/me').get(getMe, getAUser);
router.patch('/updatePassword', protectMiddleWare, updatePassword);
router.patch('/updateUserData', updateMe);
router.delete('/deleteMe', deleteMe);

// Administrator Only
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
