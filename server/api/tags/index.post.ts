import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, color, userId } = body;

  if (!name || !userId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name and userId are required",
    });
  }

  const tag = await prisma.tag.create({
    data: {
      name,
      color: color || "#3B82F6",
      userId: Number(userId),
    },
  });

  return tag;
});
