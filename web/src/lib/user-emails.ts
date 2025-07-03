import { db, User } from "@xj/db";
import { eq } from "drizzle-orm";

import { sendWelcomeEmail } from "./emails";

export async function sendWelcomeEmailToUser({
  userId,
  email,
}: {
  userId: string;
  email: string;
}): Promise<void> {
  // Get user
  const users = await db
    .select()
    .from(User)
    .where(eq(User.id, userId))
    .limit(1);

  if (users.length === 0) {
    throw new Error("User not found");
  }

  const user = users[0]!;

  if (user.emailVerifiedAt) {
    throw new Error("Email already verified for this user");
  }

  // Send welcome email
  const emailResult = await sendWelcomeEmail({
    email,
    name: user.fullName,
  });

  emailResult.orTee((error) => {
    console.error("Failed to send welcome email", { error, userId, email });
    // Don't throw - email failure shouldn't block user verification
  });

  // Update user with verified email
  await db
    .update(User)
    .set({
      email,
      emailVerifiedAt: new Date(),
    })
    .where(eq(User.id, userId));
}
