import prisma from "~~/server/utils/prisma";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (body.email === "" || body.password === "") {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required.",
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!existingUser) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  const comparePassword = await bcrypt.compare(body.password, existingUser.password);

  if (!comparePassword) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid email or password.",
    });
  }

  await setUserSession(event, {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      name: existingUser.name,
    },
    loggedInAt: new Date(),
  });

  // Login successful
  return {
    id: existingUser.id,
    email: existingUser.email,
    name: existingUser.name,
    message: "Login successful",
  };
});
