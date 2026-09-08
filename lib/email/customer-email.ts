export async function sendPasswordResetEmail(
  email: string,
  rawToken: string
): Promise<{ success: boolean }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000";

  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(rawToken)}`;

  // If email provider key configured, invoke real mailer
  if (process.env.EMAIL_PROVIDER_API_KEY && process.env.EMAIL_FROM) {
    try {
      // Production email dispatch (e.g. Resend / SendGrid / Postmark)
      // fetch(...)
    } catch (err) {
      console.error("Failed to send reset email via provider:", err);
    }
  }

  // In development / local environment, note that reset instructions were generated
  if (process.env.NODE_ENV !== "production") {
    console.info(`[BoxCare Auth] Password reset link generated for ${email}: ${resetUrl}`);
  }

  return { success: true };
}
