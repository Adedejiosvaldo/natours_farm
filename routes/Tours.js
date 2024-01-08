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

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router
  .route('/monthly-plan/:year')
  .get(
    protectMiddleWare,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );

router.route('/tour-stats').get(getTourStats);

router
  .route('/')
  .get(getAllTours)
  .post(protectMiddleWare, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getATour)
  .patch(protectMiddleWare, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protectMiddleWare, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
