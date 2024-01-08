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
const { getOne } = require('../controller/handlerControllers');

const router = express.Router();

// Signup route
router.post('/signup', signUp);
router.post('/login', login);

// Forgot and Reset Functionalities route
router.post('/forgotPassword', forgotPassword);
router.patch('/updatePassword', protectMiddleWare, updatePassword);
router.patch('/resetPassword/:token', resetPassword);

//UserUpdate
router.patch('/updateUserData', protectMiddleWare, updateMe);
router.delete('/deleteMe', protectMiddleWare, deleteMe);
//User ROute
router.route('/me').get(protectMiddleWare, getMe, getAUser);

router.route('/').get(getAllUsers);

router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
