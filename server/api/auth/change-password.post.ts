import prisma from "~~/server/utils/prisma";
import bcrypt from "bcryptjs";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const session = await getUserSession(event);

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized. Please log in.",
    });
  }

  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: "Old password and new password are required.",
    });
  }

  const userId = (session.user as { id: number }).id;

  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!userData) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found.",
    });
  }

  const isOldPasswordValid = await bcrypt.compare(oldPassword, userData.password);

  if (!isOldPasswordValid) {
    throw createError({
      statusCode: 401,
      statusMessage: "Old password is incorrect.",
    });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedNewPassword,
    },
  });

  return {
    message: "Password changed successfully.",
  };
});
