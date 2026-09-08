"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import {
  getDbProducts,
  formatPrismaProduct,
} from "@/lib/db/products";
import { logAdminActivity } from "@/lib/audit/activity-logger";

const createProductInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return "";
      return val
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }),
  categoryId: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "INACTIVE"]).default("ACTIVE"),
  imageUrl: z.string().trim().optional().nullable(),
  lengthIn: z.number().positive().optional(),
  widthIn: z.number().positive().optional(),
  heightIn: z.number().positive().optional(),
  material: z.string().trim().optional(),
  price50: z.number().positive("Price must be positive"),
  price100: z.number().positive().optional(),
  price300: z.number().positive().optional(),
  price500: z.number().positive().optional(),
  stockQuantity: z.number().int().nonnegative().default(100),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
});

export async function getAdminProductsAction(options?: {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
}) {
  try {
    const products = await getDbProducts(options);
    return { success: true, data: products };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load products";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminProductAction(rawInput: unknown, commitNote?: string) {
  try {
    const validated = createProductInputSchema.parse(rawInput);
    const lengthIn = validated.lengthIn || 6;
    const widthIn = validated.widthIn || 4;
    const heightIn = validated.heightIn || 2;
    const material = validated.material || "3-Ply Single Wall";
    const p50 = validated.price50;
    const p100 = validated.price100 || Math.round(p50 * 1.9);
    const p300 = validated.price300 || Math.round(p50 * 5.4);
    const p500 = validated.price500 || Math.round(p50 * 8.5);
    const stock = validated.stockQuantity !== undefined ? validated.stockQuantity : 100;

    let resolvedCategoryId = validated.categoryId;
    const matchedCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { id: validated.categoryId },
          { slug: validated.categoryId },
        ],
      },
    });

    if (matchedCategory) {
      resolvedCategoryId = matchedCategory.id;
    } else {
      const firstCat = await prisma.category.findFirst();
      if (firstCat) {
        resolvedCategoryId = firstCat.id;
      }
    }

    let safeSlug = validated.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    if (!safeSlug) safeSlug = `prod-${Date.now()}`;
    const existingProduct = await prisma.product.findUnique({
      where: { slug: safeSlug },
    });
    if (existingProduct) {
      safeSlug = `${safeSlug}-${Date.now().toString().slice(-4)}`;
    }

    const formattedResult = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: validated.name,
          slug: safeSlug,
          categoryId: resolvedCategoryId,
          description: validated.description || `${validated.name} - high-grade kraft corrugated packaging.`,
          status: validated.status || "ACTIVE",
          seoTitle: `${validated.name} | Box Care`,
          seoDescription: validated.description,
          images: {
            create: [
              {
                url: validated.imageUrl || "/images/box_4_4_1_5.png",
                altText: validated.name,
                sortOrder: 0,
                updatedAt: new Date(),
              },
            ],
          },
          variants: {
            create: [
              {
                sku: `${safeSlug}-50`,
                lengthIn,
                widthIn,
                heightIn,
                material,
                packQuantity: 50,
                mrpPaise: Math.round(p50 * 1.2 * 100),
                sellingPricePaise: p50 * 100,
                stockQuantity: stock,
              },
              {
                sku: `${safeSlug}-100`,
                lengthIn,
                widthIn,
                heightIn,
                material,
                packQuantity: 100,
                mrpPaise: Math.round(p100 * 1.2 * 100),
                sellingPricePaise: p100 * 100,
                stockQuantity: stock,
              },
              {
                sku: `${safeSlug}-300`,
                lengthIn,
                widthIn,
                heightIn,
                material,
                packQuantity: 300,
                mrpPaise: Math.round(p300 * 1.2 * 100),
                sellingPricePaise: p300 * 100,
                stockQuantity: stock,
              },
              {
                sku: `${safeSlug}-500`,
                lengthIn,
                widthIn,
                heightIn,
                material,
                packQuantity: 500,
                mrpPaise: Math.round(p500 * 1.2 * 100),
                sellingPricePaise: p500 * 100,
                stockQuantity: stock,
              },
            ],
          },
        },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      const formatted = formatPrismaProduct(product);

      await logAdminActivity({
        tx: tx as any,
        module: "PRODUCTS",
        action: "CREATE",
        entityType: "Product",
        entityId: product.id,
        entityName: product.name,
        commitNote,
        beforeData: null,
        afterData: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          status: product.status,
          price50: p50,
          price100: p100,
          price300: p300,
          price500: p500,
          stockQuantity: stock,
          material,
        },
      });

      return formatted;
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/activity");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: formattedResult };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create product";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminProductAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const schema = createProductInputSchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, category: true },
    });

    if (!existing) {
      return { success: false, error: `Product with id ${id} not found` };
    }

    const lengthIn = validated.lengthIn !== undefined ? validated.lengthIn : existing.variants[0]?.lengthIn || 6;
    const widthIn = validated.widthIn !== undefined ? validated.widthIn : existing.variants[0]?.widthIn || 4;
    const heightIn = validated.heightIn !== undefined ? validated.heightIn : existing.variants[0]?.heightIn || 2;
    const material = validated.material || existing.variants[0]?.material || "3-Ply Single Wall";

    let resolvedCategoryId = validated.categoryId !== undefined ? validated.categoryId : existing.categoryId;
    if (validated.categoryId) {
      const matchedCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { id: validated.categoryId },
            { slug: validated.categoryId },
          ],
        },
      });
      if (matchedCategory) {
        resolvedCategoryId = matchedCategory.id;
      }
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      categoryId: existing.categoryId,
      categoryName: existing.category?.name,
      status: existing.status,
      sellingPricePaise: existing.variants[0]?.sellingPricePaise,
      mrpPaise: existing.variants[0]?.mrpPaise,
      stockQuantity: existing.variants[0]?.stockQuantity,
      material: existing.variants[0]?.material,
    };

    const formattedResult = await prisma.$transaction(async (tx) => {
      // Update base product
      await tx.product.update({
        where: { id },
        data: {
          name: validated.name !== undefined ? validated.name : existing.name,
          slug: validated.slug !== undefined ? validated.slug : existing.slug,
          categoryId: validated.categoryId !== undefined ? validated.categoryId : existing.categoryId,
          description: validated.description !== undefined ? validated.description : existing.description,
          status: validated.status !== undefined ? validated.status : existing.status,
          seoTitle: validated.seoTitle !== undefined ? validated.seoTitle : existing.seoTitle,
          seoDescription: validated.seoDescription !== undefined ? validated.seoDescription : existing.seoDescription,
        },
      });

      // Update image if provided
      if (validated.imageUrl) {
        if (existing.images.length > 0) {
          await tx.productImage.update({
            where: { id: existing.images[0].id },
            data: { url: validated.imageUrl, updatedAt: new Date() },
          });
        } else {
          await tx.productImage.create({
            data: {
              productId: id,
              url: validated.imageUrl,
              altText: existing.name,
              sortOrder: 0,
              updatedAt: new Date(),
            },
          });
        }
      }

      // Update tier variants
      const packTiers = [
        { qty: 50, price: validated.price50 },
        { qty: 100, price: validated.price100 },
        { qty: 300, price: validated.price300 },
        { qty: 500, price: validated.price500 },
      ];

      for (const tier of packTiers) {
        const existingVariant = existing.variants.find((v) => v.packQuantity === tier.qty);
        if (existingVariant) {
          const pricePaise = tier.price !== undefined ? tier.price * 100 : existingVariant.sellingPricePaise;
          await tx.productVariant.update({
            where: { id: existingVariant.id },
            data: {
              lengthIn,
              widthIn,
              heightIn,
              material,
              sellingPricePaise: pricePaise,
              mrpPaise: Math.round(pricePaise * 1.2),
              stockQuantity: validated.stockQuantity !== undefined ? validated.stockQuantity : existingVariant.stockQuantity,
            },
          });
        }
      }

      const updated = await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      if (!updated) {
        throw new Error("Failed to retrieve updated product");
      }

      const afterSnapshot = {
        id: updated.id,
        name: updated.name,
        slug: updated.slug,
        categoryId: updated.categoryId,
        categoryName: updated.category?.name,
        status: updated.status,
        sellingPricePaise: updated.variants[0]?.sellingPricePaise,
        mrpPaise: updated.variants[0]?.mrpPaise,
        stockQuantity: updated.variants[0]?.stockQuantity,
        material: updated.variants[0]?.material,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "PRODUCTS",
        action: "UPDATE",
        entityType: "Product",
        entityId: updated.id,
        entityName: updated.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return formatPrismaProduct(updated);
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/activity");
    revalidatePath("/products");
    revalidatePath(`/product/${formattedResult.slug}`);
    revalidatePath("/");

    return { success: true, data: formattedResult };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update product";
    return { success: false, error: errorMsg };
  }
}

export async function deleteAdminProductAction(id: string, commitNote?: string) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, category: true },
    });

    if (!existing) {
      return { success: false, error: `Product with id ${id} not found` };
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      categoryId: existing.categoryId,
      categoryName: existing.category?.name,
      status: existing.status,
    };

    const referencedCount = await prisma.orderItem.count({
      where: {
        variant: {
          productId: id,
        },
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      let softDeleted = false;
      let message = "Product removed from database successfully.";

      if (referencedCount > 0) {
        await tx.product.update({
          where: { id },
          data: { status: "INACTIVE" },
        });
        softDeleted = true;
        message = "Product is referenced in historical orders and was safely marked INACTIVE.";
      } else {
        await tx.product.delete({
          where: { id },
        });
      }

      await logAdminActivity({
        tx: tx as any,
        module: "PRODUCTS",
        action: "DELETE",
        entityType: "Product",
        entityId: id,
        entityName: existing.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: null,
      });

      return { success: true, softDeleted, message };
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/activity");
    revalidatePath("/products");
    revalidatePath("/");

    return result;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete product";
    return { success: false, error: errorMsg };
  }
}

export async function toggleProductStatusAction(
  id: string,
  status: "ACTIVE" | "INACTIVE" | "DRAFT",
  commitNote?: string
) {
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!existing) {
      return { success: false, error: "Product not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      status: existing.status,
    };

    const action = status === "ACTIVE" ? "ACTIVATE" : status === "INACTIVE" ? "DEACTIVATE" : "STATUS_CHANGE";

    const updated = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.update({
        where: { id },
        data: { status },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      const afterSnapshot = {
        id: prod.id,
        name: prod.name,
        status: prod.status,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "PRODUCTS",
        action,
        entityType: "Product",
        entityId: id,
        entityName: prod.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return formatPrismaProduct(prod);
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/activity");
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update product status";
    return { success: false, error: errorMsg };
  }
}
