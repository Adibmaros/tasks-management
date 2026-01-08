import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = Number(event.context.params?.id);

  if (!userId || isNaN(userId)) {
    throw createError({ statusCode: 400, message: "Invalid user ID" });
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: "ARCHIEVED",
    },
    orderBy: { updatedAt: "desc" },
  });

  return tasks;
});
