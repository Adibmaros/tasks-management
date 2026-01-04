import bcrypt from "bcryptjs";
import prisma from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.name || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name, email, and password are required.",
    });
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (existingEmail) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email already in use.",
    });
  }

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
});
