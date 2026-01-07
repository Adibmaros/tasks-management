import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const taskId = Number(event.context.params?.id);

  if (!taskId || isNaN(taskId)) {
    throw createError({ statusCode: 400, message: "Invalid task ID" });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { startedAt: new Date() },
  });

  return task;
});
