const express = require("express");
const {
  getAllUsers,
  createUser,
  getAUser,
  updateUser,
  deleteUser,
} = require("../controller/Users");
const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getAUser).patch(updateUser).delete(deleteUser);

module.exports = router;
