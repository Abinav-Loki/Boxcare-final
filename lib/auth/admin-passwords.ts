import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const LOGIN_PASSWORD_KEY = "admin_login_password_hash";
const VERIFY_PASSWORD_KEY = "admin_verify_password_hash";
const DEFAULT_SALT_ROUNDS = 10;
const INITIAL_DEV_PASSWORD = "boxcare";

/**
 * Ensures password hashes exist in the database with secure bcrypt hashing.
 * If not present, initializes with the development password hash ("boxcare").
 */
async function getOrInitPasswordHash(key: string): Promise<string> {
  try {
    const existing = await prisma.setting.findUnique({
      where: { key },
    });

    if (existing && existing.value) {
      return existing.value;
    }

    // Initialize with bcrypt hash of initial dev password ("boxcare")
    const hash = await bcrypt.hash(INITIAL_DEV_PASSWORD, DEFAULT_SALT_ROUNDS);
    await prisma.setting.upsert({
      where: { key },
      update: { value: hash },
      create: {
        key,
        value: hash,
        description:
          key === LOGIN_PASSWORD_KEY
            ? "Hashed Admin Login Password"
            : "Hashed Admin Action Verification Password",
      },
    });

    return hash;
  } catch (error) {
    console.error(`Failed to retrieve or init setting for ${key}:`, error);
    // Fallback: Generate one-time hash for verification safely
    return bcrypt.hashSync(INITIAL_DEV_PASSWORD, DEFAULT_SALT_ROUNDS);
  }
}

const AUTHORIZED_ADMIN_EMAIL = "admin@boxcare.in";

/**
 * Validates whether the email matches the authorized corporate admin email (admin@boxcare.in).
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return email.trim().toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();
}

/**
 * Verifies the candidate password against the Admin Login password hash in database.
 */
export async function verifyAdminLoginPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") return false;
  const hash = await getOrInitPasswordHash(LOGIN_PASSWORD_KEY);
  return bcrypt.compare(password, hash);
}

/**
 * Verifies both Admin Email (must be admin@boxcare.in) and Admin Login Password against PostgreSQL.
 */
export async function verifyAdminLoginCredentials(email: string, password: string): Promise<boolean> {
  if (!isAuthorizedAdminEmail(email)) {
    return false;
  }
  return verifyAdminLoginPassword(password);
}

/**
 * Verifies the candidate password against the Admin Action Verification password hash in database.
 */
export async function verifyAdminActionPassword(password: string): Promise<boolean> {
  if (!password || typeof password !== "string") return false;
  const hash = await getOrInitPasswordHash(VERIFY_PASSWORD_KEY);
  return bcrypt.compare(password, hash);
}

/**
 * Changes the Admin Login Password after validating the current password.
 */
export async function updateAdminLoginPassword(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  if (!currentPass || !newPass) {
    return { success: false, error: "Both current and new passwords are required." };
  }

  if (newPass.length < 6) {
    return { success: false, error: "New password must be at least 6 characters long." };
  }

  const isValidCurrent = await verifyAdminLoginPassword(currentPass);
  if (!isValidCurrent) {
    return { success: false, error: "Current login password is incorrect." };
  }

  const newHash = await bcrypt.hash(newPass, DEFAULT_SALT_ROUNDS);

  await prisma.setting.upsert({
    where: { key: LOGIN_PASSWORD_KEY },
    update: { value: newHash },
    create: {
      key: LOGIN_PASSWORD_KEY,
      value: newHash,
      description: "Hashed Admin Login Password",
    },
  });

  return { success: true };
}

/**
 * Changes the Admin Action Verification Password after validating the current verification password.
 */
export async function updateAdminActionPassword(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  if (!currentPass || !newPass) {
    return { success: false, error: "Both current and new passwords are required." };
  }

  if (newPass.length < 6) {
    return { success: false, error: "New verification password must be at least 6 characters long." };
  }

  const isValidCurrent = await verifyAdminActionPassword(currentPass);
  if (!isValidCurrent) {
    return { success: false, error: "Current verification password is incorrect." };
  }

  const newHash = await bcrypt.hash(newPass, DEFAULT_SALT_ROUNDS);

  await prisma.setting.upsert({
    where: { key: VERIFY_PASSWORD_KEY },
    update: { value: newHash },
    create: {
      key: VERIFY_PASSWORD_KEY,
      value: newHash,
      description: "Hashed Admin Action Verification Password",
    },
  });

  return { success: true };
}
