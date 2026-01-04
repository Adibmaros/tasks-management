import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { taskId, newStatus, newPosition, userId } = body;

  if (!taskId || !newStatus || newPosition === undefined || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw createError({
      statusCode: 404,
      statusMessage: "Task not found",
    });
  }

  const oldStatus = task.status;
  const oldPosition = task.position;

  await prisma.$transaction(async (tx) => {
    if (oldStatus !== newStatus) {
      // Moving to different column
      // Decrease position of tasks in old column
      await tx.task.updateMany({
        where: {
          userId,
          status: oldStatus,
          position: { gt: oldPosition },
        },
        data: { position: { decrement: 1 } },
      });

      // Increase position of tasks in new column
      await tx.task.updateMany({
        where: {
          userId,
          status: newStatus,
          position: { gte: newPosition },
        },
        data: { position: { increment: 1 } },
      });

      // Update the task
      await tx.task.update({
        where: { id: taskId },
        data: { status: newStatus, position: newPosition },
      });
    } else {
      // Same column reorder
      if (oldPosition < newPosition) {
        await tx.task.updateMany({
          where: {
            userId,
            status: oldStatus,
            position: { gt: oldPosition, lte: newPosition },
          },
          data: { position: { decrement: 1 } },
        });
      } else if (oldPosition > newPosition) {
        await tx.task.updateMany({
          where: {
            userId,
            status: oldStatus,
            position: { gte: newPosition, lt: oldPosition },
          },
          data: { position: { increment: 1 } },
        });
      }

      await tx.task.update({
        where: { id: taskId },
        data: { position: newPosition },
      });
    }
  });

  return { success: true };
});
