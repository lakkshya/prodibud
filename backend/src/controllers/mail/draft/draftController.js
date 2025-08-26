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
      where: { senderId: userId, isDraft: true, isDraftDeleted: false },
      select: {
        id: true,
        sender: { select: { name: true, email: true } },
        subject: true,
        body: true,
        createdAt: true,
        draftRecipients: true,
        draftCC: true,
        draftBCC: true,
        draftAttachments: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    res.status(200).json({ drafts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch drafts" });
  }
};

const getSingleDraft = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    // Find the draft belonging to the logged-in user
    const draft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
      },
      select: {
        id: true,
        sender: { select: { name: true, email: true } },
        subject: true,
        body: true,
        createdAt: true,
        updatedAt: true,
        draftRecipients: true,
        draftCC: true,
        draftBCC: true,
        draftAttachments: true,
      },
    });

    // If no draft found
    if (!draft) {
      return res.status(404).json({ message: "Draft not found" });
    }

    //extract the IDs
    const recipientIds = draft.draftRecipients;
    const ccIds = draft.draftCC;
    const bccIds = draft.draftBCC;

    //fetch user info for those ids
    const [recipientEmails, ccEmails, bccEmails] = await Promise.all([
      prisma.user.findMany({
        where: { id: { in: recipientIds } },
        select: { id: true, email: true },
      }),
      prisma.user.findMany({
        where: { id: { in: ccIds } },
        select: { id: true, email: true },
      }),
      prisma.user.findMany({
        where: { id: { in: bccIds } },
        select: { id: true, email: true },
      }),
    ]);

    // Transform draft attachments to include public_id
    const transformedAttachments = (draft.draftAttachments || []).map(
      (att) => ({
        ...att,
        public_id: att.public_id,
        isUploading: false,
      })
    );

    res.status(200).json({
      ...draft,
      draftRecipients: recipientEmails,
      draftCC: ccEmails,
      draftBCC: bccEmails,
      draftAttachments: transformedAttachments,
    });
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
        isDraftDeleted: false, // Don't allow editing deleted drafts
      },
    });

    if (!existingDraft) {
      return res.status(404).json({
        error: "Draft not found or you don't have permission to edit it",
      });
    }

    // Update the draft
    const updatedDraft = await prisma.email.update({
      where: { id },
      data: {
        subject,
        body,
        draftRecipients: recipients,
        draftCC: cc,
        draftBCC: bcc,
        draftAttachments: attachments,
        updatedAt: new Date(), // Explicitly update timestamp if needed
      },
      select: {
        id: true,
        subject: true,
        body: true,
        draftRecipients: true,
        draftCC: true,
        draftBCC: true,
        draftAttachments: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: "Draft updated successfully",
      draft: updatedDraft,
    });
  } catch (err) {
    console.error("Update draft error:", err);
    res.status(500).json({ error: "Failed to update draft" });
  }
};

const deleteDraft = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.email.update({
      where: { id, senderId: userId },
      data: {
        isDraftDeleted: true,
      },
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
