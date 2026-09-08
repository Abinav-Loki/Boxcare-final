"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  getDbProducts,
  getDbProductById,
  getDbProductBySlug,
  createDbProduct,
  updateDbProduct,
  deleteDbProduct,
  toggleDbProductStatus,
} from "@/lib/db/products";

const createProductInputSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  categoryId: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("ACTIVE"),
  imageUrl: z.string().trim().optional(),
  lengthIn: z.number().positive().optional(),
  widthIn: z.number().positive().optional(),
  heightIn: z.number().positive().optional(),
  material: z.string().trim().optional(),
  price50: z.number().positive("Price must be positive"),
  price100: z.number().positive().optional(),
  price300: z.number().positive().optional(),
  price500: z.number().positive().optional(),
  stockQuantity: z.number().int().nonnegative().default(100),
});

export async function getAdminProductsAction(options?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
}) {
  try {
    const products = await getDbProducts(options);
    return { success: true, data: products };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load products" };
  }
}

export async function createAdminProductAction(rawInput: unknown) {
  try {
    const validated = createProductInputSchema.parse(rawInput);
    const created = await createDbProduct(validated);

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create product" };
  }
}

export async function updateAdminProductAction(id: string, rawInput: unknown) {
  try {
    const schema = createProductInputSchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbProduct(id, validated);

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath(`/product/${updated.slug}`);
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update product" };
  }
}

export async function deleteAdminProductAction(id: string) {
  try {
    const result = await deleteDbProduct(id);

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return result;
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete product" };
  }
}

export async function toggleProductStatusAction(id: string, status: "ACTIVE" | "INACTIVE" | "DRAFT") {
  try {
    const updated = await toggleDbProductStatus(id, status);

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update product status" };
  }
}
