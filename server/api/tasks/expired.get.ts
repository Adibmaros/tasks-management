import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = Number(query.userId);

  if (!userId || isNaN(userId)) {
    throw createError({ statusCode: 400, message: "Invalid user ID" });
  }

  const now = new Date();

  // Find tasks that are DOING, have duration, and time has expired
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: "DOING",
      durationMinutes: { not: null },
      startedAt: { not: null },
    },
  });

  const expiredTasks = tasks.filter((task) => {
    if (!task.startedAt || !task.durationMinutes) return false;
    const deadline = new Date(task.startedAt.getTime() + task.durationMinutes * 60 * 1000);
    return now >= deadline;
  });

  return expiredTasks;
});
