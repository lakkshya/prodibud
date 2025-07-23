const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateRecipients = async (req, res) => {
  const { recipients = [], cc = [], bcc = [] } = req.body;

  const allEmails = [...recipients, ...cc, ...bcc];

  try {
    const users = await prisma.user.findMany({
      where: { email: { in: allEmails } },
      select: { email: true, id: true },
    });

    const foundEmails = users.map((u) => u.email);
    const emailMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

    //helper function to split valid and invalid email
    const categorize = (list) => {
      const valid = list
        .filter((email) => foundEmails.includes(email))
        .map((email) => ({ email, id: emailMap[email] }));
      const invalid = list.filter((email) => !foundEmails.includes(email));

      return { valid, invalid };
    };

    res.json({
      recipients: categorize(recipients),
      cc: categorize(cc),
      bcc: categorize(bcc),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to validate email" });
  }
};

const sendEmail = async (req, res) => {
  const {
    subject,
    body,
    recipients = [],
    cc = [],
    bcc = [],
    attachments = [],
  } = req.body;

  if (!recipients || recipients.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one recipient is required" });
  }

  try {
    const email = await prisma.email.create({
      data: {
        subject,
        body,
        sender: { connect: { id: req.user.id } },
        recipients: {
          create: recipients.map((id) => ({
            user: { connect: { id } },
          })),
        },
        cc: {
          create: cc.map((id) => ({
            user: { connect: { id } },
          })),
        },
        bcc: {
          create: bcc.map((id) => ({
            user: { connect: { id } },
          })),
        },
        attachments: {
          create: attachments.map((att) => ({
            filename: att.filename,
            url: att.url,
          })),
        },
      },
    });

    res.status(201).json({ message: "Email sent successfully", email });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
};

const getInbox = async (req, res) => {
  try {
    const inbox = await prisma.email.findMany({
      where: {
        recipients: {
          some: { userId: req.user.id },
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: true,
        cc: true,
        bcc: false,
        attachments: true,
      },
    });

    res.json(inbox);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
};

const getSent = async (req, res) => {
  try {
    const sentEmails = await prisma.email.findMany({
      where: {
        senderId: req.user.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        recipients: true,
        cc: true,
        bcc: true,
        attachments: true,
      },
    });

    res.json(sentEmails);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
};

const markAsRead = async (req, res) => {
  const { emailId } = req.params;
  const userId = req.user.id;

  try {
    await prisma.recipient.updateMany({
      where: { emailId, userId },
      data: { read: true },
    });

    await prisma.cCRecipient.updateMany({
      where: { emailId, userId },
      data: { read: true },
    });

    await prisma.bCCRecipient.updateMany({
      where: { emailId, userId },
      data: { read: true },
    });

    res.status(200).json({ message: "Email marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  validateRecipients,
  sendEmail,
  getInbox,
  getSent,
  markAsRead,
  saveDraft,
  getDrafts,
  editDraft,
  sendDraft,
  deleteDraft,
};
