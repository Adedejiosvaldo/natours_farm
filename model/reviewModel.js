const mongoose = require('mongoose');

const Tours = require('./Tours');

const reviewSchema = mongoose.Schema(
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
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tours',
      required: [true, 'Review must belong to a tour'],
    },

    user: {
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({ path: 'tour', select: 'name' }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //   console.log(tourId);
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour', // What we are grouping  by --- It references the tour in the schema
        nRatings: { $sum: 1 }, // Number of ratins - sum adds each document up (1+1)
        avgRating: { $avg: '$ratings' },
      },
    },
  ]);
  await Tours.findByIdAndUpdate(tourId, {
    ratingQuantity: stats[0].nRatings,
    ratingsAverage: stats[0].avgRating,
  });
};

// The POST middleware does not have access to next
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
