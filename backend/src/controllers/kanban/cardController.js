const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCard = async (req, res) => {
  const { columnId } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    // Find the last card (highest position) in this column
    const lastCard = await prisma.card.findFirst({
      where: { columnId },
      orderBy: { position: "desc" },
    });
    // New card's position = last position + 1 (or 1 if none exists)
    const newPosition = lastCard ? lastCard.position + 1 : 1;

    const newCard = await prisma.card.create({
      data: {
        title,
        description,
        dueDate,
        position: newPosition,
        columnId,
      },
      include: {
        members: {
          include: { user: true },
        },
      },
    });

    res.status(201).json(newCard);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create card" });
  }
};

const assignMembersToCard = async (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.body;

  try {
    //find the card + board
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { column: { include: { board: true } } },
    });
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const boardId = card.column.boardId;

    //check if user is a part of the board
    const isBoardMember = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId,
        status: "accepted",
      },
    });
    if (!isBoardMember) {
      return res.status(400).json({ message: "User is not a board member" });
    }

    //check if the user is already assigned to a card
    const existing = await prisma.cardMember.findFirst({
      where: {
        cardId,
        userId,
      },
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User already assigned to this card" });
    }

    const cardMember = await prisma.cardMember.create({
      data: {
        cardId,
        userId,
      },
    });

    res.status(200).json(cardMember);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to assign member to card" });
  }
};

const getAllCards = async (req, res) => {
  const { boardId } = req.params;

  try {
    const cards = await prisma.card.findMany({
      where: {
        column: {
          boardId,
        },
      },
      include: {
        column: {
          select: {
            id: true,
            name: true,
            boardId: true,
          },
        },
        members: {
          include: { user: true },
        },
      },
      orderBy: { position: "asc" },
    });

    res.status(200).json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cards" });
  }
};

const deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.card.delete({
      where: { id },
    });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete card" });
  }
};

const updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, position, columnId, members } = req.body;

  try {
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (position !== undefined) updateData.position = position;
    if (columnId !== undefined) updateData.columnId = columnId;

    // Handle members (optional)
    if (members !== undefined) {
      updateData.members = {
        set: [], // clears old members
        connect: members.map((id) => ({ userId: id })), // reconnect new ones
      };
    }

    const updatedCard = await prisma.card.update({
      where: { id },
      data: updateData,
      include: {
        members: {
          include: { user: true },
        },
        column: true,
      },
    });

    res.status(200).json(updatedCard);
  } catch (err) {
    console.error("Error updating card:", err);
    res.status(500).json({ error: "Failed to update card" });
  }
};

module.exports = {
  createCard,
  assignMembersToCard,
  getAllCards,
  deleteCard,
  updateCard,
};
