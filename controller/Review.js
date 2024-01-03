<<<<<<< HEAD
const Tours = require('../model/Tours');
const Reviews = require('../model/reviewModel');
const catchAsyncErrors = require('../utils/catchAsync');

const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  //   const reviews = await Reviews.find();

  const tour = await Tours.find();
  res.status(200).json({
    status: 'Success',
    noOfTours: tour.length,
    data: {
      tour,
    },
  });

  //   if (reviews.length === 0) {
  //     return res.status(200).json({
  //       status: 'sucess',
  //       message: 'No Review so far',
  //     });
  //   }
  //   res.status(200).json({
  //     status: 'sucess',
  //     count: reviews.length,
  //     data: { reviews },
  //   });
=======
const Reviews = require('../model/reviewModel');
const catchAsyncErrors = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Reviews.find();

  if (reviews.length === 0) {
    return res.status(200).json({
      status: 'sucess',
      message: 'No Review so far',
    });
  }
  res.status(200).json({
    status: 'sucess',
    count: reviews.length,
    data: { reviews },
  });
>>>>>>> db093841c0ca82d5066da7f2207cee15ab6e33c8
});

const createNewReview = catchAsyncErrors(async (req, res, next) => {
  const newTour = await Reviews.create(req.body);

  res.status(200).json({
    status: 'success',
    data: { newTour },
  });
});

module.exports = { getAllReviews, createNewReview };
