const express = require("express");
const router = express.Router();
const {
  checkEmail,
  signup,
  login,
} = require("../controllers/auth/authController");

router.post("/check-email", checkEmail);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
