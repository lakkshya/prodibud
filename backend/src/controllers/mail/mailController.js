const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  markAsRead,
};
