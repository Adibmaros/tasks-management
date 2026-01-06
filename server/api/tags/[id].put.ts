import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  const body = await readBody(event);

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid tag ID",
    });
  }

  const { name, color } = body;

  const tag = await prisma.tag.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(color && { color }),
    },
  });

  return tag;
});
