const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const restoreEmailFromTrash = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    //check if it is a trashed draft mail
    const draft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
        isDraftDeleted: true,
      },
    });

    if (draft) {
      await prisma.email.updateMany({
        where: {
          id,
          senderId: userId,
          isDraft: true,
          isDraftDeleted: true,
        },
        data: {
          isDraftDeleted: false,
        },
      });

      return res
        .status(200)
        .json({ message: "Draft restored from trash successfully" });
    }

    //otherwise, for trashed inbox mail
    const recipient = await prisma.recipient.updateMany({
      where: {
        userId,
        emailId: id,
      },
      data: {
        isDeleted: false,
      },
    });

    const cc = await prisma.cCRecipient.updateMany({
      where: {
        userId,
        emailId: id,
      },
      data: {
        isDeleted: false,
      },
    });

    const bcc = await prisma.bCCRecipient.updateMany({
      where: {
        userId,
        emailId: id,
      },
      data: {
        isDeleted: false,
      },
    });

    if (recipient.count === 0 && cc.count === 0 && bcc.count === 0) {
      return res.status(404).json({ error: "Email not found for this user" });
    }

    return res
      .status(200)
      .json({ message: "Email restored from trash successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to restore email from trash" });
  }
};

const getTrashEmails = async (req, res) => {
  const userId = req.user.id;

  try {
    const [recipientTrash, ccTrash, bccTrash, draftTrash] = await Promise.all([
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

      prisma.email.findMany({
        where: {
          senderId: userId,
          isDraftDeleted: true,
        },
        include: {
          sender: {
            select: {
              name: true,
              email: true,
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
      ...draftTrash,
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
    //check if this is a trashed draft
    const draft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
        isDraftDeleted: true,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
        attachments: true,
      },
    });

    if (draft) {
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

      return res.status(200).json({
        ...draft,
        draftRecipients: recipientEmails,
        draftCC: ccEmails,
        draftBCC: bccEmails,
      });
    }

    //otherwise, check if it's a trashed inbox mail
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

    return res.status(200).json(mail);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the email" });
  }
};

module.exports = {
  restoreEmailFromTrash,
  getTrashEmails,
  getSingleTrashEmail,
};
