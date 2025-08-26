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
      ...recipientMails.map((r) => r.email),
      ...ccMails.map((c) => c.email),
      ...bccMails.map((b) => b.email),
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
        attachments: {
          select: {
            filename: true,
            url: true,
            publicId: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(mail);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the email" });
  }
};

const deleteInboxMail = async (req, res) => {
  const userId = req.user.id;
  const { id: emailId } = req.params;

  try {
    const recipient = await prisma.recipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: true,
      },
    });

    const cc = await prisma.cCRecipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: true,
      },
    });

    const bcc = await prisma.bCCRecipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: true,
      },
    });

    if (recipient.count === 0 && cc.count === 0 && bcc.count === 0) {
      return res.status(404).json({ error: "Email not found for this user" });
    }

    res.status(200).json({ message: "Email moved to trash successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to move email to trash" });
  }
};

module.exports = { getInboxMails, getSingleInboxMail, deleteInboxMail };
