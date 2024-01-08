const Tours = require('../model/Tours');
const Reviews = require('../model/reviewModel');
const catchAsyncErrors = require('../utils/catchAsync');
const { deleteOne } = require('./handlerControllers');

const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  // Checks if it recives any req.params.tourId - If yes
  // It creates object that the Review finds and sends back as the response (Almost like FIndById)
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  //   If no req.params.tourId -> It fetches the full reviews
  const reviews = await Reviews.find(filter);

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
});

const createNewReview = catchAsyncErrors(async (req, res, next) => {
  // get tour id
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // get user id
  if (!req.body.user) req.body.user = req.user._id;

  const newTour = await Reviews.create(req.body);

  res.status(200).json({
    status: 'success',
    data: { newTour },
  });
});

const deleteReview = deleteOne(Reviews);

module.exports = { getAllReviews, createNewReview, deleteReview };
