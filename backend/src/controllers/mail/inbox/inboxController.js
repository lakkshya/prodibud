const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all inbox mails
const getInboxMails = async (req, res) => {
  const userId = req.user.id;

  try {
    const [recipientMails, ccMails, bccMails] = await Promise.all([
      prisma.recipient.findMany({
        where: { userId, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
              cc: true,
              attachments: true,
            },
          },
        },
      }),

      prisma.cCRecipient.findMany({
        where: { userId, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
              cc: true,
              attachments: true,
            },
          },
        },
      }),

      prisma.bCCRecipient.findMany({
        where: { userId, isDeleted: false },
        include: {
          email: {
            include: {
              sender: true,
              cc: true,
              attachments: true,
            },
          },
        },
      }),
    ]);

    // Combine and flatten
    const allInbox = [
      ...recipientMails.map((r) => ({
        ...r.email,
        updatedAt: r.updatedAt,
        role: "To", // Optional: To show role
      })),
      ...ccMails.map((c) => ({
        ...c.email,
        updatedAt: c.updatedAt,
        role: "CC",
      })),
      ...bccMails.map((b) => ({
        ...b.email,
        updatedAt: b.updatedAt,
        role: "BCC",
      })),
    ];

    // Remove duplicates (in case the same user is in both To and CC)
    const seen = new Set();
    const uniqueInbox = allInbox.filter((mail) => {
      if (seen.has(mail.id)) return false;
      seen.add(mail.id);
      return true;
    });

    // Sort by updatedAt descending
    uniqueInbox.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json(uniqueInbox);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch inbox" });
  }
};

//get single inbox mail
const getSingleInboxMail = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const mail = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          {
            recipients: {
              some: { userId, isDeleted: false },
            },
          },
          {
            cc: {
              some: { userId, isDeleted: false },
            },
          },
          {
            bcc: {
              some: { userId, isDeleted: false },
            },
          },
        ],
      },
      include: {
        sender: true,
        cc: {
          include: {
            user: true,
          },
        },
        attachments: true,
        recipients: {
          include: {
            user: true,
          },
        },
      },
    });

    res.status(200).json(mail);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the email" });
  }
};

module.exports = { getInboxMails, getSingleInboxMail };
