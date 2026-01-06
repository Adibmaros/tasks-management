import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const taskId = Number(query.taskId);
  const tagId = Number(query.tagId);

  await prisma.taskTag.delete({
    where: {
      taskId_tagId: { taskId, tagId }, // Mencari berdasarkan Composite Primary Key
    },
  });
  return { success: true };
});
