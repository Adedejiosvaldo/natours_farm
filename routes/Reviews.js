const express = require('express');
const { getAllReviews, createNewReview } = require('../controller/Review');
const {
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protectMiddleWare, restrictTo('user'), createNewReview);

module.exports = router;
