const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//get all inbox mails
const getInboxMails = async (req, res) => {
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

//get single inbox mail
const getSingleInboxMail = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const mail = await prisma.email.findFirst({
      where: {
        id,
        recipients: {
          some: { userId },
        },
      },
      include: {
        sender: true,
        cc: true,
        attachments: true,
      },
    });

    res.json(mail);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch the email" });
  }
};

module.exports = { getInboxMails, getSingleInboxMail };
