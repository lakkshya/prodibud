const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const moveEmailToTrash = async (req, res) => {
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

const restoreEmailFromTrash = async (req, res) => {
  const userId = req.user.id;
  const { id: emailId } = req.params;

  try {
    const recipient = await prisma.recipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: false,
      },
    });

    const cc = await prisma.cCRecipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: false,
      },
    });

    const bcc = await prisma.bCCRecipient.updateMany({
      where: {
        userId,
        emailId,
      },
      data: {
        isDeleted: false,
      },
    });

    if (recipient.count === 0 && cc.count === 0 && bcc.count === 0) {
      return res.status(404).json({ error: "Email not found for this user" });
    }

    res.status(200).json({ message: "Email restored from trash successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to restore email from trash" });
  }
};

const getTrashEmails = async (req, res) => {
  const userId = req.user.id;

  try {
    const [recipientTrash, ccTrash, bccTrash] = await Promise.all([
      prisma.recipient.findMany({
        where: {
          userId,
          isDeleted: true,
        },
        include: {
          email: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),

      prisma.cCRecipient.findMany({
        where: {
          userId,
          isDeleted: true,
        },
        include: {
          email: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),

      prisma.bCCRecipient.findMany({
        where: {
          userId,
          isDeleted: true,
        },
        include: {
          email: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // Flatten and use updatedAt from recipient table
    const allTrash = [
      ...recipientTrash.map((r) => ({
        ...r.email,
        updatedAt: r.updatedAt,
      })),
      ...ccTrash.map((c) => ({
        ...c.email,
        updatedAt: c.updatedAt,
      })),
      ...bccTrash.map((b) => ({
        ...b.email,
        updatedAt: b.updatedAt,
      })),
    ];

    // Sort manually by updatedAt DESC
    allTrash.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json(allTrash);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trash emails" });
  }
};

const getSingleTrashEmail = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const mail = await prisma.email.findFirst({
      where: {
        id,
        OR: [
          {
            recipients: {
              some: { userId, isDeleted: true },
            },
          },
          {
            cc: {
              some: { userId, isDeleted: true },
            },
          },
          {
            bcc: {
              some: { userId, isDeleted: true },
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

module.exports = { moveEmailToTrash, restoreEmailFromTrash, getTrashEmails, getSingleTrashEmail };
