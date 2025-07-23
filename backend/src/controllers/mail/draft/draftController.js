const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const saveDraft = async (req, res) => {
  const {
    subject,
    body,
    recipients = [],
    cc = [],
    bcc = [],
    attachments = [],
  } = req.body;
  const userId = req.user.id;

  try {
    const draft = await prisma.email.create({
      data: {
        subject,
        body,
        senderId: userId,
        isDraft: true,
        draftRecipients: recipients,
        draftCC: cc,
        draftBCC: bcc,
        draftAttachments: attachments,
      },
    });

    res.status(201).json({ message: "Draft saved", draft });
  } catch (err) {
    res.status(500).json({ error: "Failed to save draft" });
  }
};

const getDrafts = async (req, res) => {
  const userId = req.user.id;

  try {
    const drafts = await prisma.email.findMany({
      where: { senderId: userId, isDraft: true, isDeleted: false },
      select: {
        id: true,
        subject: true,
        body: true,
        createdAt: true,
        draftRecipients: true,
        draftCC: true,
        draftBCC: true,
        draftAttachments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ drafts });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

const editDraft = async (req, res) => {
  const { id } = req.params;
  const {
    subject,
    body,
    recipients = [],
    cc = [],
    bcc = [],
    attachments = [],
  } = req.body;
  const userId = req.user.id;

  try {
    const updatedDraft = await prisma.email.update({
      where: { id },
      data: {
        subject,
        body,
        senderId: userId,
        draftRecipients: recipients,
        draftCC: cc,
        draftBCC: bcc,
        draftAttachments: attachments,
      },
    });

    res.status(200).json({ message: "Draft updated", updatedDraft });
  } catch (err) {
    console.error("Update draft error:", err);
    res.status(500).json({ error: "Failed to update draft" });
  }
};

const sendDraft = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const draft = await prisma.email.findUnique({
      where: { id },
    });

    if (!draft || !draft.isDraft) {
      return res.status(404).json({ error: "Draft not found" });
    }

    if (draft.senderId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const {
      draftRecipients = [],
      draftCC = [],
      draftBCC = [],
      draftAttachments = [],
    } = draft;

    //create related records
    await prisma.recipient.createMany({
      data: draftRecipients.map((uid) => ({
        emailId: id,
        userId: uid,
      })),
    });

    await prisma.cCRecipient.createMany({
      data: draftCC.map((uid) => ({
        emailId: id,
        userId: uid,
      })),
    });

    await prisma.bCCRecipient.createMany({
      data: draftBCC.map((uid) => ({
        emailId: id,
        userId: uid,
      })),
    });

    await prisma.attachment.createMany({
      data: draftAttachments.map((att) => ({
        emailId: id,
        filename: att.filename,
        url: att.url,
      })),
    });

    //Mark as sent
    await prisma.email.update({
      where: { id },
      data: {
        isDraft: false,
        draftRecipients: null,
        draftCC: null,
        draftBCC: null,
        draftAttachments: null,
      },
    });

    res.status(200).json({ message: "Draft sent successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send draft" });
  }
};

const deleteDraft = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const draft = await prisma.email.findUnique({
      where: { id },
    });

    if (!draft || !draft.isDraft) {
      return res.status(404).json({ error: "Draft not found" });
    }
    if (draft.senderId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.email.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    res.status(200).json({ message: "Draft moved to trash" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete draft" });
  }
};

module.exports = {
    saveDraft,
    getDrafts,
    editDraft,
    sendDraft,
    deleteDraft,
};