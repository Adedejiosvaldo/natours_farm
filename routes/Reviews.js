const express = require('express');
const {
  getAllReviews,
  createNewReview,
  deleteReview,
} = require('../controller/Review');
const {
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protectMiddleWare, restrictTo('user'), createNewReview);

router.route('/:id').delete(deleteReview);

module.exports = router;
