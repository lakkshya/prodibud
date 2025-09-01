const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const validateMembers = async (req, res) => {
  const { members = [] } = req.body;

  try {
    const users = await prisma.user.findMany({
      where: { email: { in: members } },
      select: { email: true, id: true },
    });

    const foundEmails = users.map((u) => u.email);
    const emailMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

    //helper function to split valid and invalid email
    const valid = members
      .filter((email) => foundEmails.includes(email))
      .map((email) => ({ email, id: emailMap[email] }));
    const invalid = members.filter((email) => !foundEmails.includes(email));

    res.json({ valid, invalid });
  } catch (err) {
    res.status(500).json({ error: "Failed to validate email" });
  }
};

const createBoard = async (req, res) => {
  const userId = req.user.id;
  const { name, background, members = [] } = req.body;

  try {
    const board = await prisma.board.create({
      data: {
        name,
        background,
        ownerId: userId,
        members: {
          create: [
            //add owner as admin
            {
              userId: userId,
              role: "admin",
              status: "accepted",
            },
            //add invited members
            ...members.map((memberId) => ({
              userId: memberId,
              role: "member",
              status: "pending",
            })),
          ],
        },
      },
    });

    res.status(201).json(board);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create board" });
  }
};

const getAllBoards = async (req, res) => {
  const userId = req.user.id;

  try {
    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: {
            userId,
            status: "accepted",
          },
        },
      },
      select: {
        id: true,
        name: true,
        background: true,
      },
    });

    res.status(200).json(boards);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch all boards" });
  }
};

const getSingleBoard = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const board = await prisma.board.findFirst({
      where: {
        id,
        members: {
          some: {
            userId,
            status: "accepted",
          },
        },
      },
      include: {
        columns: true,
        members: {
          include: { user: true },
        },
      },
    });

    res.status(200).json(board);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch the board" });
  }
};

module.exports = {
  validateMembers,
  createBoard,
  getAllBoards,
  getSingleBoard,
};
