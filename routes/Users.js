const express = require('express');
const {
  getAllUsers,
  createUser,
  getAUser,
  updateUser,
  deleteUser,
  updateMe,
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
router.patch('/updatePassword', protectMiddleWare, updatePassword);
router.patch('/updateUserData', protectMiddleWare, updateMe );
router.patch('/resetPassword/:token', resetPassword);

//User ROute

router
  .route('/')
  .get(protectMiddleWare, restrictTo('admin', 'lead-guide'), getAllUsers)
  .post(createUser);
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
