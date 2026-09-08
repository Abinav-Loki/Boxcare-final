import { prisma } from "./prisma";

export function getDefaultCategoryImage(slug: string, name?: string): string {
  const s = `${slug} ${name || ""}`.toLowerCase();
  if (s.includes("mailer")) return "/images/mailer-boxes.png";
  if (s.includes("corrugated-box") || s.includes("corrugated boxes")) return "/images/corrugated-boxes.png";
  if (s.includes("shipping")) return "/images/shipping-boxes.png";
  if (s.includes("custom-printed") || s.includes("custom")) return "/images/custom-printed-boxes.png";
  if (s.includes("pizza") || s.includes("food")) return "/images/pizza-boxes.png";
  if (s.includes("mono") || s.includes("carton")) return "/images/mono-cartons.png";
  if (s.includes("tape")) return "/images/tape-rolls.png";
  if (s.includes("bubble")) return "/images/bubble-wrap.png";
  if (s.includes("roll")) return "/images/corrugated-rolls.png";
  if (s.includes("courier") || s.includes("bag")) return "/images/courier-bags.png";
  if (s.includes("paper")) return "/images/paper-bags.png";
  if (s.includes("sheet")) return "/images/corrugated-sheets.png";
  return "/images/mailer-boxes.png";
}

export interface FormattedCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string | null;
  imageUrl: string | null;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  status?: "ACTIVE" | "INACTIVE";
  stockStatus?: "IN_STOCK" | "OUT_OF_STOCK";
  isFeatured: boolean;
  featured?: boolean;
  offerBadge?: string;
  offerText?: string;
  seoTitle: string | null;
  seoDescription: string | null;
  productsCount: number;
  productCount?: number;
  parentName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getDbCategories() {
  const categories = await prisma.category.findMany({
    include: {
      Category: true,
      _count: {
        select: { products: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return categories.map((c) => {
    const effectiveImage = c.imageUrl || getDefaultCategoryImage(c.slug, c.name);
    let offerBadge = "";
    let offerText = "";
    if (c.seoTitle && c.seoTitle.startsWith("OFFER:")) {
      const parts = c.seoTitle.replace("OFFER:", "").split("|");
      offerBadge = parts[0] || "";
      offerText = parts[1] || "";
    }

    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      parentId: c.parentId,
      description: c.description,
      imageUrl: effectiveImage,
      image: effectiveImage,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      status: (c.isActive ? "ACTIVE" : "INACTIVE") as "ACTIVE" | "INACTIVE",
      stockStatus: (c.isActive ? "IN_STOCK" : "OUT_OF_STOCK") as "IN_STOCK" | "OUT_OF_STOCK",
      isFeatured: c.isFeatured,
      featured: c.isFeatured,
      offerBadge,
      offerText,
      seoTitle: c.seoTitle,
      seoDescription: c.seoDescription,
      productsCount: c._count.products,
      productCount: c._count.products,
      parentName: c.Category?.name || null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  });
}

export async function getDbCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      Category: true,
      products: {
        where: { status: "ACTIVE" },
        include: { images: true, variants: true },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  return category;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  parentId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export async function createDbCategory(input: CreateCategoryInput) {
  return await prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      parentId: input.parentId || null,
      description: input.description || null,
      imageUrl: input.imageUrl || null,
      sortOrder: input.sortOrder || 0,
      isActive: input.isActive !== undefined ? input.isActive : true,
      isFeatured: input.isFeatured || false,
      seoTitle: input.seoTitle || `${input.name} | Box Care`,
      seoDescription: input.seoDescription || input.description,
    },
  });
}

export async function updateDbCategory(id: string, input: Partial<CreateCategoryInput>) {
  return await prisma.category.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      parentId: input.parentId !== undefined ? input.parentId : undefined,
      description: input.description !== undefined ? input.description : undefined,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl : undefined,
      sortOrder: input.sortOrder !== undefined ? input.sortOrder : undefined,
      isActive: input.isActive !== undefined ? input.isActive : undefined,
      isFeatured: input.isFeatured !== undefined ? input.isFeatured : undefined,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle : undefined,
      seoDescription: input.seoDescription !== undefined ? input.seoDescription : undefined,
    },
  });
}

export async function deleteDbCategory(id: string) {
  // Safe Category Deletion Rule: Check if products exist in category
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productCount > 0) {
    // Cannot hard delete without breaking products, deactivate safely!
    await prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
    return {
      success: true,
      softDeleted: true,
      message: `Category contains ${productCount} products. It was safely deactivated instead of deleting.`,
    };
  }

  await prisma.category.delete({
    where: { id },
  });

  return { success: true, softDeleted: false, message: "Category deleted successfully." };
}

export async function toggleDbCategoryActive(id: string, isActive: boolean) {
  return await prisma.category.update({
    where: { id },
    data: { isActive },
  });
}
