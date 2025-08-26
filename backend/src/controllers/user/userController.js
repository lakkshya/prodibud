const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        phoneNumber: true,
        dateOfBirth: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};

module.exports = { getUser };
