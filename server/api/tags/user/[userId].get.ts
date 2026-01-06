import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const userId = Number(event.context.params?.userId);

  if (!userId || isNaN(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid user ID",
    });
  }

  const tags = await prisma.tag.findMany({
    where: { userId },
    // include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });

  return tags;
});
