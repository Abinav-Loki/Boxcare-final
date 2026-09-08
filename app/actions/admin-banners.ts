"use server";

import { revalidatePath } from "next/cache";
import { bannerSchema } from "@/lib/validation/banner";
import {
  getDbBanners,
  createDbBanner,
  updateDbBanner,
  deleteDbBanner,
  toggleDbBannerActive,
} from "@/lib/db/banners";

export async function getAdminBannersAction(location?: string) {
  try {
    const banners = await getDbBanners(location);
    return { success: true, data: banners };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load banners" };
  }
}

export async function createAdminBannerAction(rawInput: unknown) {
  try {
    const validated = bannerSchema.parse(rawInput);
    const created = await createDbBanner(validated);

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create banner" };
  }
}

export async function updateAdminBannerAction(id: string, rawInput: unknown) {
  try {
    const schema = bannerSchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbBanner(id, validated);

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update banner" };
  }
}

export async function deleteAdminBannerAction(id: string) {
  try {
    await deleteDbBanner(id);

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete banner" };
  }
}

export async function toggleBannerActiveAction(id: string, isActive: boolean) {
  try {
    const updated = await toggleDbBannerActive(id, isActive);

    revalidatePath("/admin/banners");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle banner" };
  }
}
