const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
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
    select: false,
  },

  passwordChangedAt: Date,

  confirmPassword: {
    type: String,
    required: [true, 'Kindly Confirm Password'],
    minlength: [8, 'Minimum length of 8'],
    validate: {
      //Works only on .create and .save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password do not match',
    },
  },
});

UserSchema.pre('save', function (next) {
  console.log(this.passWordChangedAt);
  next();
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Remove the confirm password
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.changedPasswordAfter = function (JWT_timeStamp) {
  if (this.passWordChangedAt) {
    console.log(this.passwordChangedAt, JWT_timeStamp);
  }

  return false;
};

module.exports = mongoose.model('User', UserSchema);