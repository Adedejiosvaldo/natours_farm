const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = mongoose.Schema(
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
      required: [true, 'A tour must have difficultly level'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Ratings must be above 1.0'],
      max: [5, 'Rating must be above 5.0'],
      //   setter function - a call back function that returns a value and returns a value
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingQuantity: {
      type: Number,
      default: 4.5,
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
      required: [true, 'Tour must have cover image'],
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
    startLocation: {
      // GeoJSON
      type: { type: 'String', default: 'Point', enum: ['Point'] },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // //Embedding TOur GUides
    // guides: Array,

    // Referencing
    guides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Single value index
// tourSchema.index({ price: 1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

// Compound index
tourSchema.index({ price: 1, ratingsAverage: -1 });

// Virtual Properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', //Connects the review field
  localField: '_id',
});

// Pre - Document Middleware
tourSchema.pre('save', function (next) {
  this.secretTour = true;
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding
// TourSchema.pre('save', async function (next) {
//   console.log(this.guides);
//   this.guides = this.guides || []; // Initialize guides as an empty array if undefined
//   const guidePromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromises);

//   next();
// });

// POST - Document Middleware
// TourSchema.post('save', function (next, doc) {});

//Query Middleware
// Pre - Query Middleware

// We are trying to get all the tours which are not secret immediately -
// How ever ,no tour is a secret tour, so i would comment this code out

// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// Populate the tour with guide
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// Post - Query Middleware
// TourSchema.post('/^find/', function (docs, next) {});

// Aggregation MiddleWare

// Pre - Hook
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

module.exports = mongoose.model('Tours', tourSchema);
