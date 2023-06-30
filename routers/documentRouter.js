const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessage,
  getAllInteractions,
} = require("../controllers/documentController");
const authenticateUser = require("../middleware/authentication");

router.route("/").get(authenticateUser, getAllInteractions);
router
  .route("/:id")
  .get(authenticateUser, getAllMessage)
  .post(authenticateUser, sendMessage);

module.exports = router;
