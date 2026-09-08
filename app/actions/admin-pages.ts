"use server";

import { revalidatePath } from "next/cache";
import { pageContentSchema } from "@/lib/validation/page";
import { getDbPages, getDbPageBySlug, updateDbPageContent } from "@/lib/db/pages";

export async function getAdminPagesAction() {
  try {
    const pages = await getDbPages();
    return { success: true, data: pages };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load pages" };
  }
}

export async function updateAdminPageAction(slug: string, rawInput: unknown) {
  try {
    const schema = pageContentSchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbPageContent(slug, validated);

    revalidatePath("/admin/pages");
    revalidatePath(`/${slug}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update page" };
  }
}
