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

// Preventing Duplicate review
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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
        nRatings: { $sum: 1 }, // Number of ratings - sum adds each document up (1+1)
        avgRating: { $avg: '$ratings' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tours.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tours.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// The POST middleware does not have access to next
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // THe update and delete cant be carried out here as it would not be saved and persisted

  // Copies the current model and saves it to r to be accessed later
  this.r = await this.clone().findOne();

  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // After whatever operations was carried out on the review, it used the remaining doc to carry out the calculation of the avaerage rating
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
