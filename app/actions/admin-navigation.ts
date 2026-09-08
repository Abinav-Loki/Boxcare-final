"use server";

import { revalidatePath } from "next/cache";
import { navigationItemSchema } from "@/lib/validation/navigation";
import { NavigationLocation } from "@/generated/prisma/client";
import {
  getDbNavigationItems,
  createDbNavigationItem,
  updateDbNavigationItem,
  deleteDbNavigationItem,
  reorderDbNavigationItems,
} from "@/lib/db/navigation";

export async function getAdminNavigationAction(location?: NavigationLocation) {
  try {
    const items = await getDbNavigationItems(location);
    return { success: true, data: items };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load navigation items" };
  }
}

export async function createAdminNavigationItemAction(rawInput: unknown) {
  try {
    const validated = navigationItemSchema.parse(rawInput);
    const created = await createDbNavigationItem(validated as any);

    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create navigation item" };
  }
}

export async function updateAdminNavigationItemAction(id: string, rawInput: unknown) {
  try {
    const schema = navigationItemSchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbNavigationItem(id, validated as any);

    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update navigation item" };
  }
}

export async function deleteAdminNavigationItemAction(id: string) {
  try {
    await deleteDbNavigationItem(id);

    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete navigation item" };
  }
}

export async function reorderAdminNavigationAction(items: { id: string; sortOrder: number }[]) {
  try {
    await reorderDbNavigationItems(items);

    revalidatePath("/admin/navigation");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to reorder navigation items" };
  }
}
