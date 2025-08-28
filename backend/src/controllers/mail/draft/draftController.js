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
        recipients: {
          create: recipients.map((r) => ({ userId: r, isDraft: true })),
        },
        cc: {
          create: cc.map((r) => ({ userId: r, isDraft: true })),
        },
        bcc: {
          create: bcc.map((r) => ({ userId: r, isDraft: true })),
        },
        attachments: {
          create: attachments.map((att) => ({
            filename: att.filename,
            url: att.url,
            publicId: att.publicId,
            isDraft: true,
          })),
        },
      },
      include: {
        recipients: { select: { id: true, userId: true } },
        cc: { select: { id: true, userId: true } },
        bcc: { select: { id: true, userId: true } },
        attachments: true,
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
      where: { senderId: userId, isDraft: true, isDraftDeleted: false },
      select: {
        id: true,
        sender: { select: { name: true, email: true } },
        subject: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        recipients: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        cc: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        bcc: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        attachments: {
          where: { isDraft: true },
          select: { id: true, filename: true, url: true, publicId: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json(drafts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

const getSingleDraft = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const draft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
        isDraftDeleted: false,
      },
      select: {
        id: true,
        sender: { select: { name: true, email: true } },
        subject: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        recipients: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        cc: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        bcc: {
          where: { isDraft: true },
          select: { user: { select: { id: true, email: true } } },
        },
        attachments: {
          where: { isDraft: true },
          select: { id: true, filename: true, url: true, publicId: true },
        },
      },
    });

    // If no draft found
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    res.status(200).json(draft);
  } catch (error) {
    console.error("Error fetching draft:", error);
    res.status(500).json({ message: "Server error" });
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
    // First, check if the draft exists and belongs to the user
    const existingDraft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
        isDraftDeleted: false,
      },
    });

    if (!existingDraft) {
      return res.status(404).json({
        error: "Draft not found",
      });
    }

    // Remove old recipients/cc/bcc/attachments
    await Promise.all([
      prisma.recipient.deleteMany({ where: { emailId: id, isDraft: true } }),
      prisma.cCRecipient.deleteMany({ where: { emailId: id, isDraft: true } }),
      prisma.bCCRecipient.deleteMany({ where: { emailId: id, isDraft: true } }),
      prisma.attachment.deleteMany({ where: { emailId: id, isDraft: true } }),
    ]);

    // Update the draft
    const updatedDraft = await prisma.email.update({
      where: { id },
      data: {
        subject,
        body,
        recipients: {
          create: recipients.map((r) => ({ userId: r, isDraft: true })),
        },
        cc: {
          create: cc.map((r) => ({ userId: r, isDraft: true })),
        },
        bcc: {
          create: bcc.map((r) => ({ userId: r, isDraft: true })),
        },
        attachments: {
          create: attachments.map((att) => ({
            filename: att.filename,
            url: att.url,
            publicId: att.publicId,
            isDraft: true,
          })),
        },
      },
      include: {
        recipients: { select: { user: { select: { id: true, email: true } } } },
        cc: { select: { user: { select: { id: true, email: true } } } },
        bcc: { select: { user: { select: { id: true, email: true } } } },
        attachments: true,
      },
    });

    res.status(200).json(updatedDraft);
  } catch (err) {
    console.error("Update draft error:", err);
    res.status(500).json({ error: "Failed to update draft" });
  }
};

const deleteDraft = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.email.updateMany({
        where: { id, senderId: userId, isDraft: true, isDraftDeleted: false },
        data: { isDraftDeleted: true },
      });

      await tx.recipient.updateMany({
        where: { emailId: id },
        data: { isDeleted: true },
      });

      await tx.cCRecipient.updateMany({
        where: { emailId: id },
        data: { isDeleted: true },
      });

      await tx.bCCRecipient.updateMany({
        where: { emailId: id },
        data: { isDeleted: true },
      });
    });

    res.status(200).json({ message: "Draft moved to trash" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete draft" });
  }
};

module.exports = {
  saveDraft,
  getDrafts,
  getSingleDraft,
  editDraft,
  deleteDraft,
};
