"use server";

import { revalidatePath } from "next/cache";
import {
  verifyAdminActionPassword,
  verifyAdminLoginPassword,
  verifyAdminLoginCredentials,
  updateAdminLoginPassword,
  updateAdminActionPassword,
} from "@/lib/auth/admin-passwords";

/**
 * Verifies the Admin Action Password before performing ANY protected database mutation.
 */
export async function verifyAdminActionPasswordAction(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!password) {
      return { success: false, error: "Password is required" };
    }
    const isValid = await verifyAdminActionPassword(password);
    if (!isValid) {
      return { success: false, error: "Incorrect password" };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to verify password" };
  }
}

/**
 * Verifies Admin Login Credentials (Email must be admin@boxcare.in and Password must match) during login.
 */
export async function verifyAdminLoginPasswordAction(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!email || !password) {
      return { success: false, error: "Both admin email and password are required" };
    }
    const isValid = await verifyAdminLoginCredentials(email, password);
    if (!isValid) {
      return { success: false, error: "Invalid admin credentials. Only authorized admin email is permitted." };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Login authentication failed" };
  }
}

/**
 * Changes the Admin Login Password.
 */
export async function changeAdminLoginPasswordAction(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await updateAdminLoginPassword(currentPass, newPass);
    if (res.success) {
      try {
        revalidatePath("/admin/settings");
      } catch {
        // Safe fallback in standalone scripts
      }
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to change login password" };
  }
}

/**
 * Changes the Admin Action Verification Password.
 */
export async function changeAdminActionPasswordAction(
  currentPass: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await updateAdminActionPassword(currentPass, newPass);
    if (res.success) {
      try {
        revalidatePath("/admin/settings");
      } catch {
        // Safe fallback in standalone scripts
      }
    }
    return res;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to change verification password" };
  }
}
