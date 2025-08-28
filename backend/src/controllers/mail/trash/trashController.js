const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../../../../config/cloudinary");

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
      await prisma.$transaction(async (tx) => {
        await tx.email.updateMany({
          where: { id, senderId: userId, isDraft: true, isDraftDeleted: true },
          data: { isDraftDeleted: false },
        });

        await tx.recipient.updateMany({
          where: { emailId: id },
          data: { isDeleted: false },
        });

        await tx.cCRecipient.updateMany({
          where: { emailId: id },
          data: { isDeleted: false },
        });

        await tx.bCCRecipient.updateMany({
          where: { emailId: id },
          data: { isDeleted: false },
        });
      });

      return res
        .status(200)
        .json({ message: "Draft restored from trash successfully" });
    }

    //Check if it is a trashed sent mail
    const sent = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: false,
        isSentDeleted: true,
        isSentPermanentlyDeleted: false,
      },
    });

    if (sent) {
      await prisma.email.update({
        where: { id },
        data: { isSentDeleted: false },
      });

      return res
        .status(200)
        .json({ message: "Sent mail restored from trash successfully" });
    }

    //otherwise, for trashed inbox mail
    const recipient = await prisma.recipient.updateMany({
      where: {
        userId,
        emailId: id,
        isDraft: false,
      },
      data: {
        isDeleted: false,
      },
    });

    const cc = await prisma.cCRecipient.updateMany({
      where: {
        userId,
        emailId: id,
        isDraft: false,
      },
      data: {
        isDeleted: false,
      },
    });

    const bcc = await prisma.bCCRecipient.updateMany({
      where: {
        userId,
        emailId: id,
        isDraft: false,
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
    const [recipientTrash, ccTrash, bccTrash, draftTrash, sentTrash] =
      await Promise.all([
        //inbox recipients
        prisma.recipient.findMany({
          where: {
            userId,
            isDraft: false,
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

        //inbox cc
        prisma.cCRecipient.findMany({
          where: {
            userId,
            isDraft: false,
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

        //inbox bcc
        prisma.bCCRecipient.findMany({
          where: {
            userId,
            isDraft: false,
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

        //draft
        prisma.email.findMany({
          where: {
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
          },
        }),

        //sent
        prisma.email.findMany({
          where: {
            senderId: userId,
            isDraft: false,
            isSentDeleted: true,
            isSentPermanentlyDeleted: false,
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

    // Flatten
    const allTrash = [
      ...recipientTrash.map((r) => r.email),
      ...ccTrash.map((c) => c.email),
      ...bccTrash.map((b) => b.email),
      ...draftTrash,
      ...sentTrash,
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
        sender: { select: { name: true, email: true } },
        recipients: { select: { user: { select: { id: true, email: true } } } },
        cc: { select: { user: { select: { id: true, email: true } } } },
        bcc: { select: { user: { select: { id: true, email: true } } } },
        attachments: true,
      },
    });

    if (draft) {
      return res.status(200).json(draft);
    }

    //check if it is a trashed sent mail
    const sent = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: false,
        isSentDeleted: true,
        isSentPermanentlyDeleted: false,
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
        recipients: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        cc: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        bcc: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        attachments: true,
      },
    });

    if (sent) {
      return res.status(200).json(sent);
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

const deleteFromTrash = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    //check if the trashed mail is a draft
    const draft = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: true,
        isDraftDeleted: true,
      },
      include: {
        attachments: true,
      },
    });

    if (draft) {
      //delete attachments from cloudinary
      if (draft.attachments && Array.isArray(draft.attachments)) {
        for (const attachment of draft.attachments) {
          if (attachment.publicId) {
            try {
              await cloudinary.uploader.destroy(attachment.publicId);
            } catch (cloudErr) {
              console.error(
                `Cloudinary delete failed for ${attachment.publicId}`,
                cloudErr
              );
            }
          }
        }
      }

      await prisma.email.delete({
        where: {
          id,
        },
      });

      return res
        .status(200)
        .json({ message: "Draft permanently deleted from trash" });
    }

    //check if the trashed mail is a sent mail
    const sent = await prisma.email.findFirst({
      where: {
        id,
        senderId: userId,
        isDraft: false,
        isSentDeleted: true,
        isSentPermanentlyDeleted: false,
      },
    });

    if (sent) {
      await prisma.email.update({
        where: { id },
        data: { isSentPermanentlyDeleted: true },
      });

      return res.status(200).json({
        message: "Sent mail permanently deleted from trash",
      });
    }

    //otherwise, for trashed inbox mail
    await prisma.recipient.deleteMany({
      where: {
        emailId: id,
        userId,
        isDraft: false,
      },
    });

    await prisma.cCRecipient.deleteMany({
      where: {
        emailId: id,
        userId,
        isDraft: false,
      },
    });

    await prisma.bCCRecipient.deleteMany({
      where: {
        emailId: id,
        userId,
        isDraft: false,
      },
    });

    res.status(200).json({ message: "Mail permanently deleted from trash" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete from trash" });
  }
};

module.exports = {
  restoreEmailFromTrash,
  getTrashEmails,
  getSingleTrashEmail,
  deleteFromTrash,
};
