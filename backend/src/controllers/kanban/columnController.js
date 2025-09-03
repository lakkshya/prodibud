const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createColumn = async (req, res) => {
  const { name } = req.body;
  const { boardId } = req.params;

  try {
    // Find the last column (highest position) in this board
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { position: "desc" },
    });
    // New column's position = last position + 1 (or 1 if none exists)
    const newPosition = lastColumn ? lastColumn.position + 1 : 1;

    await prisma.column.create({
      data: {
        name,
        position: newPosition,
        boardId,
      },
    });

    //return fresh list for all clients
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    res.status(201).json(columns);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create column" });
  }
};

const getAllColumns = async (req, res) => {
  const { boardId } = req.params;

  try {
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: { position: "asc" },
    });

    res.status(200).json(columns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
};

const deleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.column.delete({
      where: {
        id,
      },
    });

    res.status(200).json({ message: "Column deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to deleted column" });
  }
};

const renameColumn = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const renamedColumn = await prisma.column.update({
      where: { id },
      data: { name },
    });

    res.status(200).json(renamedColumn);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rename column" });
  }
};

module.exports = { createColumn, getAllColumns, deleteColumn, renameColumn };
