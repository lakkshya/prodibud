const express = require("express");
const router = express.Router();

const {
  searchInboxMails,
  searchDraftMails,
  searchSentMails,
  searchTrashMails,
} = require("../controllers/mail/search/searchController");

const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.get("/inbox", protect, searchInboxMails);
router.get("/drafts", protect, searchDraftMails);
router.get("/sent", protect, searchSentMails);
router.get("/trash", protect, searchTrashMails);

module.exports = router;
