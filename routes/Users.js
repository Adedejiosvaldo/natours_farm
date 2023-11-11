const express = require('express');
const {
  getAllUsers,
  createUser,
  getAUser,
  updateUser,
  deleteUser,
} = require('../controller/Users');
const { signUp } = require('../controller/authController');

const router = express.Router();

// Signup route
router.post('/signup', signUp);

//User ROute

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
