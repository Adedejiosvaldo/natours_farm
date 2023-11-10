const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less than or equal to 40 chars'],
      minlength: [10, 'TOur name must have greater than or equal to 40 chars'],
      //   validate: [validator.isAlpha, 'Tour name cannot contain number'],
    },
    slug: String,

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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Diffuclty can either be : easy,medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingQuantity: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.o'],
      max: [5, 'Rating must be above 5.0'],
    },

    price: {
      type: Number,
      required: [true, 'Price must be added'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Properties
TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Pre - Document Middleware
TourSchema.pre('save', function (next) {
  this.secretTour = true;
  this.slug = slugify(this.name, { lower: true });

  next();
});

// POST - Document Middleware
// TourSchema.post('save', function (next, doc) {});

//Query Middleware
// Pre - Query Middleware
TourSchema.pre('/^find/', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Post - Query Middleware
TourSchema.post('/^find/', function (docs, next) {});

// Aggregation MiddleWare

// Pre - Hook
TourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});
module.exports = mongoose.model('Tours', TourSchema);
