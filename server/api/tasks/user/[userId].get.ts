import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, "userId");

  console.log("📡 API: GET /api/tasks/user/[userId] called");
  console.log("📡 API: userId param:", userId);

  if (!userId || isNaN(Number(userId))) {
    console.error("❌ API: Invalid userId:", userId);
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid user ID",
    });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: [{ status: "asc" }, { position: "asc" }],
    });

    console.log("✅ API: Tasks found:", tasks.length);
    return tasks;
  } catch (error) {
    console.error("❌ API: Database error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch tasks",
    });
  }
});
