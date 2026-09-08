"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { getDbSettings } from "@/lib/db/settings";
import { settingsSchema } from "@/lib/validation";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminSettingsAction() {
  try {
    const settings = await getDbSettings();
    return { success: true, data: settings };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch settings";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminSettingsAction(rawSettings: Record<string, string>, commitNote?: string) {
  try {
    const validated = settingsSchema.parse(rawSettings);

    const existingSettings = await prisma.setting.findMany();
    const beforeSnapshot: Record<string, string> = {};
    for (const s of existingSettings) {
      beforeSnapshot[s.key] = s.value;
    }

    const updated = await prisma.$transaction(async (tx) => {
      const results: Record<string, string> = {};
      for (const [key, value] of Object.entries(validated)) {
        const item = await tx.setting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        });
        results[item.key] = item.value;
      }

      await logAdminActivity({
        tx: tx as any,
        module: "SETTINGS",
        action: "UPDATE",
        entityType: "Setting",
        entityName: "Store Settings",
        commitNote,
        beforeData: beforeSnapshot,
        afterData: results,
      });

      return results;
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/activity");
    revalidatePath("/admin");

    return { success: true, data: updated };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update settings";
    return { success: false, error: errorMsg };
  }
}
