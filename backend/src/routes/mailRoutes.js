const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware.js");
const { markAsRead } = require("../controllers/mail/mailController");
const {
  validateRecipients,
  uploadAttachment,
  deleteAttachment,
  sendEmail,
} = require("../controllers/mail/compose/composeController");
const {
  getInboxMails,
  getSingleInboxMail,
  deleteInboxMail,
} = require("../controllers/mail/inbox/inboxController");
const {
  restoreEmailFromTrash,
  getTrashEmails,
  getSingleTrashEmail,
  deleteFromTrash,
} = require("../controllers/mail/trash/trashController");
const {
  saveDraft,
  getDrafts,
  getSingleDraft,
  editDraft,
  deleteDraft,
} = require("../controllers/mail/draft/draftController");
const { getSent } = require("../controllers/mail/sent/sentController");

const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.put("/read/:emailId", protect, markAsRead);

//compose
router.post("/validate-recipients", protect, validateRecipients);
router.post(
  "/upload-attachments",
  protect,
  upload.array("attachments"),
  uploadAttachment
);
router.delete("/attachments/:public_id", protect, deleteAttachment);
router.post("/send", protect, sendEmail);

//inbox
router.get("/inbox", protect, getInboxMails);
router.get("/inbox/:id", protect, getSingleInboxMail);
router.put("/inbox/:id/delete", protect, deleteInboxMail);

//trash
router.put("/trash/restore/:id", protect, restoreEmailFromTrash);
router.get("/trash", protect, getTrashEmails);
router.get("/trash/:id", protect, getSingleTrashEmail);
router.delete("/trash/delete/:id", protect, deleteFromTrash);

//draft
router.post("/draft", protect, saveDraft);
router.get("/drafts", protect, getDrafts);
router.get("/draft/:id", protect, getSingleDraft);
router.put("/draft/:id", protect, editDraft);
router.put("/draft/:id/delete", protect, deleteDraft);

//sent
router.get("/sent", protect, getSent);

module.exports = router;
