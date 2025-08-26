const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getSentEmails = async (req, res) => {
  const userId = req.user.id;

  try {
    const sentEmails = await prisma.email.findMany({
      where: {
        senderId: userId,
        isDraft: false,
        isSentDeleted: false,
        isSentPermanentlyDeleted: false,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        sender: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json(sentEmails);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch sent emails" });
  }
};

const getSingleSentEmail = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const sentEmail = await prisma.email.findFirst({
      where: {
        senderId: userId,
        id,
        isDraft: false,
        isSentDeleted: false,
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
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        cc: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        bcc: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        attachments: {
          select: {
            filename: true,
            url: true,
            publicId: true,
          },
        },
      },
    });

    res.status(200).json(sentEmail);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch single sent email" });
  }
};

const deleteSentEmail = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.email.updateMany({
      where: {
        senderId: userId,
        id,
        isDraft: false,
        isSentDeleted: false,
        isSentPermanentlyDeleted: false,
      },
      data: {
        isSentDeleted: true,
      },
    });

    res.status(200).json({ message: "Sent email moved to trash" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete sent email" });
  }
};

module.exports = {
  getSentEmails,
  getSingleSentEmail,
  deleteSentEmail,
};
