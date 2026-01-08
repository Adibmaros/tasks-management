import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid tag ID",
    });
  }

  await prisma.tag.delete({
    where: { id },
  });

  return { message: "Tag deleted successfully" };
});
