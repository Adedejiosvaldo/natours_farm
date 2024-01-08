const express = require('express');
const {
  getAllTours,
  createTour,
  getATour,
  updateTour,
  deleteTour,
  // Other Routes
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controller/Tours');
const reviewRouter = require('./Reviews');
const {
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');
const { getAllReviews, createNewReview } = require('../controller/Review');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);
router
  .route('/:id')
  .get( getATour)
  .patch(updateTour)
  .delete(protectMiddleWare, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
