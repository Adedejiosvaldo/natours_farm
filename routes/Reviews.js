const express = require('express');
const {
  getAllReviews,
  createNewReview,
  deleteReview,
  updateReview,
  setTourAndUserID,
  getAReview,
} = require('../controller/Review');
const {
  protectMiddleWare,
  restrictTo,
} = require('../controller/authController');

const router = express.Router({ mergeParams: true });
router.use(protectMiddleWare);

// Nested Routes
router
  .route('/')
  .get(getAllReviews) // -> Gets all the review within a tour where the tourid = tour
  .post(restrictTo('user'), setTourAndUserID, createNewReview); // Creates nested review for a tour

router
  .route('/:id')
  .delete(restrictTo('user', 'admin'), deleteReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .get(getAReview);

module.exports = router;
