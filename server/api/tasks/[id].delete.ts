import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, "id") || "0");

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid task ID",
    });
  }

  await prisma.task.delete({
    where: { id },
  });

  return { success: true };
});
