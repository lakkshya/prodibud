const express = require("express");
const router = express.Router();

const {
  validateMembers,
  createBoard,
  getAllBoards,
  getSingleBoard,
  getBoardMembers
} = require("../controllers/kanban/boardController");
const protect = require("../middlewares/authMiddleware");
const {
  createColumn,
  getAllColumns,
  deleteColumn,
  renameColumn,
} = require("../controllers/kanban/columnController");
const {
  createCard,
  assignMembersToCard,
  getAllCards,
  deleteCard,
  updateCard,
} = require("../controllers/kanban/cardController");

//board
router.post("/validate-members", protect, validateMembers);
router.post("/board", protect, createBoard);
router.get("/boards", protect, getAllBoards);
router.get("/board/:id", protect, getSingleBoard);
router.get("/board/:id/members", protect, getBoardMembers);

//column
router.post("/board/:boardId/column", protect, createColumn);
router.get("/board/:boardId/columns", protect, getAllColumns);
router.delete("/column/:id/delete", protect, deleteColumn);
router.put("/column/:id/rename", protect, renameColumn);

//card
router.post("/column/:columnId/card", protect, createCard);
router.post("/card/:id/assign", protect, assignMembersToCard);
router.get("/board/:boardId/cards", protect, getAllCards);
router.delete("/card/:id/delete", protect, deleteCard);
router.put("/card/:id/update", protect, updateCard);

module.exports = router;
