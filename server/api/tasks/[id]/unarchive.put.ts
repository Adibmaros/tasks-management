import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const taskId = Number(event.context.params?.id);

  if (!taskId || isNaN(taskId)) {
    throw createError({ statusCode: 400, message: "Invalid task ID" });
  }

  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw createError({ statusCode: 404, message: "Task not found" });
  }

  const lastPosition = await prisma.task.count({
    where: {
      userId: task.userId,
      status: "PLAN",
    },
  });

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: "PLAN",
      position: lastPosition,
    },
  });

  return updatedTask;
});
