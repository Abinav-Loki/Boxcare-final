"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { navigationItemSchema } from "@/lib/validation/navigation";
import { NavigationLocation } from "@/generated/prisma/client";
import { getDbNavigationItems } from "@/lib/db/navigation";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminNavigationAction(location?: NavigationLocation) {
  try {
    const items = await getDbNavigationItems(location);
    return { success: true, data: items };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load navigation items";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminNavigationItemAction(rawInput: unknown, commitNote?: string) {
  try {
    const validated = navigationItemSchema.parse(rawInput);

    const created = await prisma.$transaction(async (tx) => {
      const item = await tx.navigationItem.create({
        data: {
          label: validated.label,
          location: validated.location as NavigationLocation,
          type: validated.type as any,
          destination: validated.destination,
          sortOrder: validated.sortOrder || 0,
          isActive: validated.isActive !== undefined ? validated.isActive : true,
        },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "NAVIGATION",
        action: "CREATE",
        entityType: "NavigationItem",
        entityId: item.id,
        entityName: item.label,
        commitNote,
        beforeData: null,
        afterData: item,
      });

      return item;
    });

    revalidatePath("/admin/navigation");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create navigation item";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminNavigationItemAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const schema = navigationItemSchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.navigationItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Navigation item not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      label: existing.label,
      location: existing.location,
      type: existing.type,
      destination: existing.destination,
      sortOrder: existing.sortOrder,
      isActive: existing.isActive,
    };

    const updated = await prisma.$transaction(async (tx) => {
      const item = await tx.navigationItem.update({
        where: { id },
        data: {
          label: validated.label !== undefined ? validated.label : undefined,
          location: validated.location !== undefined ? (validated.location as NavigationLocation) : undefined,
          type: validated.type !== undefined ? (validated.type as any) : undefined,
          destination: validated.destination !== undefined ? validated.destination : undefined,
          sortOrder: validated.sortOrder !== undefined ? validated.sortOrder : undefined,
          isActive: validated.isActive !== undefined ? validated.isActive : undefined,
        },
      });

      const afterSnapshot = {
        id: item.id,
        label: item.label,
        location: item.location,
        type: item.type,
        destination: item.destination,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "NAVIGATION",
        action: "UPDATE",
        entityType: "NavigationItem",
        entityId: item.id,
        entityName: item.label,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return item;
    });

    revalidatePath("/admin/navigation");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update navigation item";
    return { success: false, error: errorMsg };
  }
}

export async function deleteAdminNavigationItemAction(id: string, commitNote?: string) {
  try {
    const existing = await prisma.navigationItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Navigation item not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      label: existing.label,
      location: existing.location,
      destination: existing.destination,
    };

    await prisma.$transaction(async (tx) => {
      await tx.navigationItem.delete({
        where: { id },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "NAVIGATION",
        action: "DELETE",
        entityType: "NavigationItem",
        entityId: id,
        entityName: existing.label,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: null,
      });
    });

    revalidatePath("/admin/navigation");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete navigation item";
    return { success: false, error: errorMsg };
  }
}

export async function reorderAdminNavigationAction(
  items: { id: string; sortOrder: number }[],
  commitNote?: string
) {
  try {
    if (!items || items.length === 0) {
      return { success: true };
    }

    const ids = items.map((i) => i.id);
    const existing = await prisma.navigationItem.findMany({
      where: { id: { in: ids } },
      select: { id: true, label: true, sortOrder: true },
    });

    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.navigationItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        });
      }

      await logAdminActivity({
        tx: tx as any,
        module: "NAVIGATION",
        action: "REORDER",
        entityType: "NavigationItem",
        entityName: "Navigation Order",
        commitNote,
        beforeData: existing,
        afterData: items,
      });
    });

    revalidatePath("/admin/navigation");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to reorder navigation items";
    return { success: false, error: errorMsg };
  }
}
