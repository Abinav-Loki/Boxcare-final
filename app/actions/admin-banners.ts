"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { bannerSchema } from "@/lib/validation/banner";
import { getDbBanners } from "@/lib/db/banners";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminBannersAction(location?: string) {
  try {
    const banners = await getDbBanners(location);
    return { success: true, data: banners };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load banners";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminBannerAction(rawInput: unknown, commitNote?: string) {
  try {
    const validated = bannerSchema.parse(rawInput);

    const created = await prisma.$transaction(async (tx) => {
      const banner = await tx.banner.create({
        data: {
          title: validated.title,
          subtitle: validated.subtitle || null,
          imageUrl: validated.imageUrl,
          linkUrl: validated.linkUrl || null,
          location: validated.location || "HOME_HERO",
          sortOrder: validated.sortOrder || 0,
          isActive: validated.isActive !== undefined ? validated.isActive : true,
        },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "BANNERS",
        action: "CREATE",
        entityType: "Banner",
        entityId: banner.id,
        entityName: banner.title,
        commitNote,
        beforeData: null,
        afterData: banner,
      });

      return banner;
    });

    revalidatePath("/admin/banners");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create banner";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminBannerAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const schema = bannerSchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Banner not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      title: existing.title,
      subtitle: existing.subtitle,
      imageUrl: existing.imageUrl,
      linkUrl: existing.linkUrl,
      location: existing.location,
      sortOrder: existing.sortOrder,
      isActive: existing.isActive,
    };

    const updated = await prisma.$transaction(async (tx) => {
      const banner = await tx.banner.update({
        where: { id },
        data: {
          title: validated.title !== undefined ? validated.title : undefined,
          subtitle: validated.subtitle !== undefined ? validated.subtitle : undefined,
          imageUrl: validated.imageUrl !== undefined ? validated.imageUrl : undefined,
          linkUrl: validated.linkUrl !== undefined ? validated.linkUrl : undefined,
          location: validated.location !== undefined ? validated.location : undefined,
          sortOrder: validated.sortOrder !== undefined ? validated.sortOrder : undefined,
          isActive: validated.isActive !== undefined ? validated.isActive : undefined,
        },
      });

      const afterSnapshot = {
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl,
        location: banner.location,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "BANNERS",
        action: "UPDATE",
        entityType: "Banner",
        entityId: banner.id,
        entityName: banner.title,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return banner;
    });

    revalidatePath("/admin/banners");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update banner";
    return { success: false, error: errorMsg };
  }
}

export async function deleteAdminBannerAction(id: string, commitNote?: string) {
  try {
    const existing = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Banner not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      title: existing.title,
      location: existing.location,
      isActive: existing.isActive,
    };

    await prisma.$transaction(async (tx) => {
      await tx.banner.delete({
        where: { id },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "BANNERS",
        action: "DELETE",
        entityType: "Banner",
        entityId: id,
        entityName: existing.title,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: null,
      });
    });

    revalidatePath("/admin/banners");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete banner";
    return { success: false, error: errorMsg };
  }
}

export async function toggleBannerActiveAction(id: string, isActive: boolean, commitNote?: string) {
  try {
    const existing = await prisma.banner.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Banner not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      title: existing.title,
      isActive: existing.isActive,
    };

    const action = isActive ? "PUBLISH" : "UNPUBLISH";

    const updated = await prisma.$transaction(async (tx) => {
      const banner = await tx.banner.update({
        where: { id },
        data: { isActive },
      });

      const afterSnapshot = {
        id: banner.id,
        title: banner.title,
        isActive: banner.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "BANNERS",
        action,
        entityType: "Banner",
        entityId: id,
        entityName: banner.title,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return banner;
    });

    revalidatePath("/admin/banners");
    revalidatePath("/admin/activity");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle banner";
    return { success: false, error: errorMsg };
  }
}
