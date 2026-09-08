"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { categorySchema } from "@/lib/validation/category";
import { getDbCategories, getDefaultCategoryImage } from "@/lib/db/categories";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminCategoriesAction() {
  try {
    const categories = await getDbCategories();
    return { success: true, data: categories };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load categories";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminCategoryAction(rawInput: unknown, commitNote?: string) {
  try {
    const validated = categorySchema.parse(rawInput);

    let safeSlug = validated.slug;
    if (!safeSlug) {
      safeSlug = validated.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (!safeSlug) safeSlug = `category-${Date.now()}`;

    // Deduplicate slug if already exists
    const existingCat = await prisma.category.findUnique({ where: { slug: safeSlug } });
    if (existingCat) {
      safeSlug = `${safeSlug}-${Date.now().toString().slice(-4)}`;
    }

    const created = await prisma.$transaction(async (tx) => {
      const category = await tx.category.create({
        data: {
          name: validated.name,
          slug: safeSlug,
          parentId: validated.parentId || null,
          description: validated.description || null,
          imageUrl: validated.imageUrl || null,
          sortOrder: validated.sortOrder || 0,
          isActive: validated.isActive !== undefined ? validated.isActive : true,
          isFeatured: validated.isFeatured || false,
          seoTitle: validated.seoTitle || `${validated.name} | Box Care`,
          seoDescription: validated.seoDescription || validated.description,
        },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "CATEGORIES",
        action: "CREATE",
        entityType: "Category",
        entityId: category.id,
        entityName: category.name,
        commitNote,
        beforeData: null,
        afterData: category,
      });

      return category;
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin/activity");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    const effectiveImage = created.imageUrl || getDefaultCategoryImage(created.slug, created.name);
    let offerBadge = "";
    let offerText = "";
    if (created.seoTitle && created.seoTitle.startsWith("OFFER:")) {
      const parts = created.seoTitle.replace("OFFER:", "").split("|");
      offerBadge = parts[0] || "";
      offerText = parts[1] || "";
    }

    const formatted = {
      id: created.id,
      name: created.name,
      slug: created.slug,
      parentId: created.parentId,
      description: created.description || "",
      imageUrl: effectiveImage,
      image: effectiveImage,
      sortOrder: created.sortOrder,
      isActive: created.isActive,
      status: (created.isActive ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
      stockStatus: (created.isActive ? "IN_STOCK" : "OUT_OF_STOCK") as "IN_STOCK" | "OUT_OF_STOCK",
      isFeatured: created.isFeatured,
      featured: created.isFeatured,
      offerBadge,
      offerText,
      seoTitle: created.seoTitle,
      seoDescription: created.seoDescription,
      productsCount: 0,
      productCount: 0,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };

    return { success: true, data: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminCategoryAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const schema = categorySchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    let safeSlug = validated.slug;
    if (safeSlug && safeSlug !== existing.slug) {
      const existingSlug = await prisma.category.findUnique({ where: { slug: safeSlug } });
      if (existingSlug && existingSlug.id !== id) {
        safeSlug = `${safeSlug}-${Date.now().toString().slice(-4)}`;
      }
    } else if (safeSlug === undefined) {
      safeSlug = undefined;
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      parentId: existing.parentId,
      description: existing.description,
      imageUrl: existing.imageUrl,
      sortOrder: existing.sortOrder,
      isActive: existing.isActive,
      isFeatured: existing.isFeatured,
      seoTitle: existing.seoTitle,
      seoDescription: existing.seoDescription,
    };

    const updated = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.update({
        where: { id },
        data: {
          name: validated.name !== undefined ? validated.name : undefined,
          slug: safeSlug !== undefined ? safeSlug : undefined,
          parentId: validated.parentId !== undefined ? validated.parentId : undefined,
          description: validated.description !== undefined ? validated.description : undefined,
          imageUrl: validated.imageUrl !== undefined ? validated.imageUrl : undefined,
          sortOrder: validated.sortOrder !== undefined ? validated.sortOrder : undefined,
          isActive: validated.isActive !== undefined ? validated.isActive : undefined,
          isFeatured: validated.isFeatured !== undefined ? validated.isFeatured : undefined,
          seoTitle: validated.seoTitle !== undefined ? validated.seoTitle : undefined,
          seoDescription: validated.seoDescription !== undefined ? validated.seoDescription : undefined,
        },
      });

      const afterSnapshot = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        parentId: cat.parentId,
        description: cat.description,
        imageUrl: cat.imageUrl,
        sortOrder: cat.sortOrder,
        isActive: cat.isActive,
        isFeatured: cat.isFeatured,
        seoTitle: cat.seoTitle,
        seoDescription: cat.seoDescription,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "CATEGORIES",
        action: "UPDATE",
        entityType: "Category",
        entityId: cat.id,
        entityName: cat.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return cat;
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin/activity");
    revalidatePath("/categories");
    revalidatePath(`/category/${updated.slug}`);
    revalidatePath("/products");
    revalidatePath("/");

    const count = await prisma.product.count({ where: { categoryId: updated.id } });
    const effectiveImage = updated.imageUrl || getDefaultCategoryImage(updated.slug, updated.name);
    let offerBadge = "";
    let offerText = "";
    if (updated.seoTitle && updated.seoTitle.startsWith("OFFER:")) {
      const parts = updated.seoTitle.replace("OFFER:", "").split("|");
      offerBadge = parts[0] || "";
      offerText = parts[1] || "";
    }

    const formatted = {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      parentId: updated.parentId,
      description: updated.description || "",
      imageUrl: effectiveImage,
      image: effectiveImage,
      sortOrder: updated.sortOrder,
      isActive: updated.isActive,
      status: (updated.isActive ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
      stockStatus: (updated.isActive ? "IN_STOCK" : "OUT_OF_STOCK") as "IN_STOCK" | "OUT_OF_STOCK",
      isFeatured: updated.isFeatured,
      featured: updated.isFeatured,
      offerBadge,
      offerText,
      seoTitle: updated.seoTitle,
      seoDescription: updated.seoDescription,
      productsCount: count,
      productCount: count,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };

    return { success: true, data: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update category";
    return { success: false, error: errorMsg };
  }
}

export async function deleteAdminCategoryAction(id: string, commitNote?: string) {
  try {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
    });

    if (!existing) {
      // Category is not in DB (or already removed)
      return { success: true, softDeleted: false, message: "Category removed successfully." };
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      slug: existing.slug,
      isActive: existing.isActive,
    };

    const productCount = await prisma.product.count({
      where: {
        OR: [
          { categoryId: existing.id },
          { category: { slug: existing.slug } },
        ],
      },
    });

    const result = await prisma.$transaction(async (tx) => {
      let softDeleted = false;
      let message = "Category deleted successfully.";

      if (productCount > 0) {
        // Check if any product in this category has orders
        const orderItemCount = await tx.orderItem.count({
          where: {
            variant: {
              product: {
                categoryId: existing.id,
              },
            },
          },
        });

        if (orderItemCount > 0) {
          await tx.category.update({
            where: { id: existing.id },
            data: { isActive: false },
          });
          softDeleted = true;
          message = `Category contains ${productCount} products with order history. It was safely deactivated.`;
        } else {
          // Delete child variants, images, and products
          const prods = await tx.product.findMany({
            where: {
              OR: [
                { categoryId: existing.id },
                { category: { slug: existing.slug } },
              ],
            },
            select: { id: true },
          });
          const prodIds = prods.map((p) => p.id);
          if (prodIds.length > 0) {
            await tx.productVariant.deleteMany({ where: { productId: { in: prodIds } } });
            await tx.productImage.deleteMany({ where: { productId: { in: prodIds } } });
            await tx.product.deleteMany({ where: { id: { in: prodIds } } });
          }
          await tx.category.delete({
            where: { id: existing.id },
          });
          message = `Category "${existing.name}" was permanently deleted.`;
        }
      } else {
        await tx.category.delete({
          where: { id: existing.id },
        });
      }

      await logAdminActivity({
        tx: tx as any,
        module: "CATEGORIES",
        action: "DELETE",
        entityType: "Category",
        entityId: existing.id,
        entityName: existing.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: null,
      });

      return { success: true, softDeleted, message };
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    revalidatePath("/admin/activity");
    revalidatePath("/categories");
    revalidatePath("/products");
    revalidatePath("/");

    return result;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete category";
    return { success: false, error: errorMsg };
  }
}

export async function toggleCategoryActiveAction(id: string, isActive: boolean, commitNote?: string) {
  try {
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { id },
          { slug: id },
        ],
      },
    });

    if (!existing) {
      return { success: false, error: "Category not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      name: existing.name,
      isActive: existing.isActive,
    };

    const action = isActive ? "ACTIVATE" : "DEACTIVATE";

    const updated = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.update({
        where: { id },
        data: { isActive },
      });

      const afterSnapshot = {
        id: cat.id,
        name: cat.name,
        isActive: cat.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "CATEGORIES",
        action,
        entityType: "Category",
        entityId: id,
        entityName: cat.name,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return cat;
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/activity");
    revalidatePath("/categories");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle category";
    return { success: false, error: errorMsg };
  }
}
