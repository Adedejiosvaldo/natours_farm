const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const crypto = require('crypto');
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
  roles: {
    type: String,
    enum: {
      values: ['user', 'admin', 'guide', 'lead-guide'],
      message: 'Difficulty can either be : user,admin, guide,lead-guide',
    },
  },

  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [8, 'Minimum length of 8'],
    select: false,
  },
  active: {
    default: true,
    type: Boolean,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

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

// Middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Remove the confirm password
  this.confirmPassword = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//Methods
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
UserSchema.methods.changedPasswordAfter = function (JWTtimeStanp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTtimeStanp < changedTimeStamp;
  }
  // JWT Token is less than the changedTimeStamp
  //False Means not changed

  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
