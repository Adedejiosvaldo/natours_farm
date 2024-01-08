const express = require('express');
const {
  getAllReviews,
  createNewReview,
  deleteReview,
  updateReview,
  setTourAndUserID,
} = require('../controller/Review');
const {
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(
    protectMiddleWare,
    restrictTo('user'),
    setTourAndUserID,
    createNewReview,
  );

router.route('/:id').delete(deleteReview).patch(updateReview);

module.exports = router;
