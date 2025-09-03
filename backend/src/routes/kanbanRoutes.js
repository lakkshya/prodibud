const express = require("express");
const router = express.Router();

const {
  validateMembers,
  createBoard,
  getAllBoards,
  getSingleBoard,
} = require("../controllers/kanban/boardController");
const protect = require("../middlewares/authMiddleware");
const {
  createColumn,
  getAllColumns,
  deleteColumn,
  renameColumn,
} = require("../controllers/kanban/columnController");

//board
router.post("/validate-members", protect, validateMembers);
router.post("/board", protect, createBoard);
router.get("/boards", protect, getAllBoards);
router.get("/board/:id", protect, getSingleBoard);

//column
router.post("/board/:boardId/column", protect, createColumn);
router.get("/board/:boardId/columns", protect, getAllColumns);
router.delete("/column/:id/delete", protect, deleteColumn);
router.put("/column/:id/rename", protect, renameColumn);

module.exports = router;
