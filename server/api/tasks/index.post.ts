import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, description, status, userId } = body;

  if (!name || !userId) {
    throw createError({
      statusCode: 400,
      message: "name and userId are required",
    });
  }

  try {
    // Get the max position for the status column
    const maxPositionResult = await prisma.task.aggregate({
      where: {
        userId: Number(userId),
        status: status || "PLAN",
      },
      _max: { position: true },
    });

    const newPosition = (maxPositionResult._max.position ?? -1) + 1;

    const task = await prisma.task.create({
      data: {
        name,
        description: description || null,
        status: status || "PLAN",
        position: newPosition,
        userId: Number(userId),
      },
    });

    return task;
  } catch (error) {
    console.error("Error creating task:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to create task",
    });
  }
});
