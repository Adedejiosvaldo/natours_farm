const mongoose = require('mongoose');

reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    ratings: {
      type: Number,
      default: 4.0,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    refToTour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tours',
      required: [true, 'Review must belong to a tour'],
    },

    refToUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review can only be made by user'],
    },
  },
  // Makes sure - we can display fields and data not stored in db
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

module.exports = mongoose.model('Review', reviewSchema);
