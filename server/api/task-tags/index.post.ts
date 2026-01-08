import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { taskId, tagId } = body;

  if (!taskId || !tagId) {
    throw createError({
      statusCode: 400,
      message: "taskId and tagId are required",
    });
  }

  const taskTag = await prisma.taskTag.create({
    data: {
      taskId: Number(taskId),
      tagId: Number(tagId),
    },
    include: {
      tag: true,
    },
  });

  return taskTag;
});
