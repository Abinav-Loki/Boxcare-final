"use server";

import { revalidatePath } from "next/cache";
import { categorySchema } from "@/lib/validation/category";
import {
  getDbCategories,
  getDbCategoryBySlug,
  createDbCategory,
  updateDbCategory,
  deleteDbCategory,
  toggleDbCategoryActive,
} from "@/lib/db/categories";

export async function getAdminCategoriesAction() {
  try {
    const categories = await getDbCategories();
    return { success: true, data: categories };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load categories" };
  }
}

export async function createAdminCategoryAction(rawInput: unknown) {
  try {
    const validated = categorySchema.parse(rawInput);
    const created = await createDbCategory(validated);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create category" };
  }
}

export async function updateAdminCategoryAction(id: string, rawInput: unknown) {
  try {
    const schema = categorySchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbCategory(id, validated);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");
    revalidatePath(`/category/${updated.slug}`);
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update category" };
  }
}

export async function deleteAdminCategoryAction(id: string) {
  try {
    const result = await deleteDbCategory(id);

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/categories");
    revalidatePath("/");

    return result;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete category" };
  }
}

export async function toggleCategoryActiveAction(id: string, isActive: boolean) {
  try {
    const updated = await toggleDbCategoryActive(id, isActive);

    revalidatePath("/admin/categories");
    revalidatePath("/categories");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle category" };
  }
}
