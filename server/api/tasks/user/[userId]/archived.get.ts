import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const userId = Number(getRouterParam(event, "userId"));

  if (!userId || isNaN(userId)) {
    throw createError({ statusCode: 400, message: "Invalid user ID" });
  }

  const archivedTasks = await prisma.task.findMany({
    where: {
      userId,
      status: "ARCHIEVED",
    },
    orderBy: { updatedAt: "desc" },
  });

  return archivedTasks;
});
