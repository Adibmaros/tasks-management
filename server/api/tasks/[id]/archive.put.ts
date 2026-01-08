import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const taskId = Number(event.context.params?.id);

  if (!taskId || isNaN(taskId)) {
    throw createError({ statusCode: 400, message: "Invalid task ID" });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { status: "ARCHIEVED" },
  });

  return task;
});
