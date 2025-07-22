const express = require("express");
const router = express.Router();
const {
  validateRecipients,
  sendEmail,
  getInbox,
  getSent,
} = require("../controllers/mailController");
const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.post("/validate-recipients", protect, validateRecipients);
router.post("/send", protect, sendEmail);
router.get("/inbox", protect, getInbox);
router.get("/sent", protect, getSent);

module.exports = router;
