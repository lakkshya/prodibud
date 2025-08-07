const express = require("express");
const router = express.Router();
const {
  validateRecipients,
  sendEmail,
  getSent,
  markAsRead,
} = require("../controllers/mail/mailController");
const {
  getInboxMails,
  getSingleInboxMail,
} = require("../controllers/mail/inbox/inboxController");
const {
  moveEmailToTrash,
  restoreEmailFromTrash,
  getTrashEmails,
  getSingleTrashEmail,
} = require("../controllers/mail/trash/trashController");
const {
  saveDraft,
  getDrafts,
  editDraft,
  sendDraft,
  deleteDraft,
} = require("../controllers/mail/draft/draftController");
const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.post("/validate-recipients", protect, validateRecipients);
router.post("/send", protect, sendEmail);

router.get("/inbox", protect, getInboxMails);
router.get("/inbox/:id", protect, getSingleInboxMail);

router.get("/sent", protect, getSent);
router.put("/read/:emailId", protect, markAsRead);

//draft
router.put("/trash/:id", protect, moveEmailToTrash);
router.put("/trash/restore/:id", protect, restoreEmailFromTrash);
router.get("/trash", protect, getTrashEmails);
router.get("/trash/:id", protect, getSingleTrashEmail);

//draft
router.post("/draft", protect, saveDraft);
router.get("/drafts", protect, getDrafts);
router.put("/draft/:id", protect, editDraft);
router.post("/draft/:id/send", protect, sendDraft);
router.patch("/draft/:id/delete", protect, deleteDraft);

module.exports = router;
