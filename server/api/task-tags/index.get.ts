import prisma from "~~/server/utils/prisma";
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const taskId = Number(query.taskId);

  const data = await prisma.taskTag.findMany({
    where: { taskId },
    include: { tag: true }, // Harus include 'tag' agar dapet nama & warna
  });

  return data.map((item) => item.tag); // Flattening agar frontend dapet Array Tag
});
