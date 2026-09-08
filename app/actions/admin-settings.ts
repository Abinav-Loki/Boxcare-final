"use server";

import { revalidatePath } from "next/cache";
import { getDbSettings, updateDbSettings } from "@/lib/db/settings";
import { settingsSchema } from "@/lib/validation";

export async function getAdminSettingsAction() {
  try {
    const settings = await getDbSettings();
    return { success: true, data: settings };
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return { success: false, error: error.message || "Failed to fetch settings" };
  }
}

export async function updateAdminSettingsAction(rawSettings: Record<string, string>) {
  try {
    const validated = settingsSchema.parse(rawSettings);
    const updated = await updateDbSettings(validated);
    revalidatePath("/admin/settings");
    revalidatePath("/admin");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return { success: false, error: error.message || "Failed to update settings" };
  }
}
