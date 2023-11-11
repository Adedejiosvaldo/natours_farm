const mongoose = require('mongoose');
const validator = require('validator');
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Incorrect email : Enter Correct EMail'],
  },
  photoUrl: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Minimum length of 8'],
  },
  confirmPassword: {
    type: String,
    required: [true, 'Kindly Confirm Password'],
    minlength: [8, 'Minimum length of 8'],
  },
});

module.exports = mongoose.model('User', UserSchema);
