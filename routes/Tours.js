const express = require('express');
const {
  getAllTours,
  createTour,
  getATour,
  updateTour,
  deleteTour,
} = require('../controller/Tours');
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getATour).patch(updateTour).delete(deleteTour);

module.exports = router;
