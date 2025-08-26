const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/user/userController");

const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.get("/me", protect, getUser);

module.exports = router;
