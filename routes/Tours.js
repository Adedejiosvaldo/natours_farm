const express = require("express");
const {
  getAllTours,
  createTour,
  getATour,
  updateTour,
  checkID,
} = require("../controller/Tours");
const router = express.Router();

router.param("id", checkID);

router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getATour).patch(updateTour).delete();

module.exports = router;
