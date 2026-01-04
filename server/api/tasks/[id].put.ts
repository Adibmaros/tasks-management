import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id") || "0");
  const body = await readBody(event);
  const { name, description } = body;

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID",
    });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      name,
      description: description || null,
    },
  });

  return task;
});
