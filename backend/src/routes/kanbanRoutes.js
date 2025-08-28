const express = require("express");
const router = express.Router();

const {
  createBoard,
  getAllBoards,
  getSingleBoard,
} = require("../controllers/kanban/boardController");
const protect = require("../middlewares/authMiddleware");

//board
router.post("/board", protect, createBoard);
router.get("/boards", protect, getAllBoards);
router.get("/board/:id", protect, getSingleBoard);

module.exports = router;
