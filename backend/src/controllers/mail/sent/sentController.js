const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = {
  getSent
};