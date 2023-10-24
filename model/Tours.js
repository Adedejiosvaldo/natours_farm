const mongoose = require('mongoose');

const TourSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },

  difficulty: {
    type: String,
    required: [true, 'A toour must have difficultly level'],
  },

  ratingsAverage: {
    type: Number,
    default: 4.5,
  },

  ratingQuantity: {
    type: Number,
    default: 4.5,
  },

  price: {
    type: Number,
    required: [true, 'Price must be added'],
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a Description'],
  },

  description: {
    type: String,
    trim: true,
  },

  imageCover: {
    type: String,
    required: [true, 'Tour must have civer image'],
  },

  //Array of images - Array of strings
  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  //Array of date - Difrent dates of tours
  startDates: [Date],
});

module.exports = mongoose.model('Tours', TourSchema);
