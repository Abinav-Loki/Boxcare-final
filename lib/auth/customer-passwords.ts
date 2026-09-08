import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

export async function hashCustomerPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyCustomerPassword(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
}

export function hashResetToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export function generateResetToken(): { rawToken: string; tokenHash: string; expiresAt: Date } {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashResetToken(rawToken);
  // 1 hour expiration
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  return { rawToken, tokenHash, expiresAt };
}
