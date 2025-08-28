const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createBoard = async (req, res) => {
  const userId = req.user.id;
  const { name, columns = [], members = [] } = req.body;

  try {
    const board = await prisma.board.create({
      data: {
        name,
        ownerId: userId,
        columns: {
          create: columns.map((col) => ({
            name: col.name,
            position: col.position,
          })),
        },
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
      include: {
        columns: true,
        members: {
          include: { user: true },
        },
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
  createBoard,
  getAllBoards,
  getSingleBoard,
};
