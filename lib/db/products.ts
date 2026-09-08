import { prisma } from "./prisma";
import { ProductStatus } from "@/generated/prisma/client";

export interface FormattedProductVariant {
  id: string;
  sku: string | null;
  lengthIn: number | null;
  widthIn: number | null;
  heightIn: number | null;
  material: string;
  packQuantity: number;
  mrpPaise: number;
  sellingPricePaise: number;
  stockQuantity: number;
}

export interface FormattedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  categoryId: string;
  size_inches: string;
  size_inches_short: string;
  size_cm: string;
  length_in: number;
  width_in: number;
  height_in: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  description: string;
  features: string[];
  prices: {
    "50": number;
    "100": number;
    "300": number;
    "500": number;
    [key: string]: number;
  };
  contact_number: string;
  availability: string;
  image: string;
  specifications: Record<string, string>;
  rating?: number;
  reviewsCount?: number;
  isPopular?: boolean;
  offerBadge?: string;
  offerDiscountPercent?: number;
  status: ProductStatus;
  variants: FormattedProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export function formatPrismaProduct(p: any): FormattedProduct {
  const v50 = p.variants?.find((v: any) => v.packQuantity === 50) || p.variants?.[0];
  const v100 = p.variants?.find((v: any) => v.packQuantity === 100);
  const v300 = p.variants?.find((v: any) => v.packQuantity === 300);
  const v500 = p.variants?.find((v: any) => v.packQuantity === 500);

  const lengthIn = v50?.lengthIn || 6;
  const widthIn = v50?.widthIn || 4;
  const heightIn = v50?.heightIn || 2;

  const lengthCm = parseFloat((lengthIn * 2.54).toFixed(2));
  const widthCm = parseFloat((widthIn * 2.54).toFixed(2));
  const heightCm = parseFloat((heightIn * 2.54).toFixed(2));

  const prices: any = {
    "50": v50 ? Math.round(v50.sellingPricePaise / 100) : 250,
    "100": v100 ? Math.round(v100.sellingPricePaise / 100) : (v50 ? Math.round((v50.sellingPricePaise * 1.9) / 100) : 480),
    "300": v300 ? Math.round(v300.sellingPricePaise / 100) : (v50 ? Math.round((v50.sellingPricePaise * 5.4) / 100) : 1350),
    "500": v500 ? Math.round(v500.sellingPricePaise / 100) : (v50 ? Math.round((v50.sellingPricePaise * 8.5) / 100) : 2200),
  };

  const isAvailable = p.status === "ACTIVE";
  const image = p.images?.[0]?.url || "/images/box_4_4_1_5.png";

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category?.name || "Mailer Boxes",
    categorySlug: p.category?.slug || "mailer-boxes",
    categoryId: p.categoryId,
    size_inches: `${lengthIn} inch X ${widthIn} inch X ${heightIn} inch`,
    size_inches_short: `${lengthIn}x${widthIn}x${heightIn}`,
    size_cm: `${lengthCm} cm x ${widthCm} cm x ${heightCm} cm`,
    length_in: lengthIn,
    width_in: widthIn,
    height_in: heightIn,
    length_cm: lengthCm,
    width_cm: widthCm,
    height_cm: heightCm,
    description: p.description || `${p.name} - high-grade kraft corrugated packaging.`,
    features: [
      "High Crush Resistance",
      "Eco-Friendly Sustainable Kraft",
      "Precision Die-Cut Flaps",
      "Pan-India Dispatch",
    ],
    prices,
    contact_number: "+91 98765 43210",
    availability: isAvailable ? "In Stock" : "Out of Stock",
    image,
    specifications: {
      Material: v50?.material || "3-Ply E-Flute Kraft",
      Dimensions: `${lengthIn} x ${widthIn} x ${heightIn} Inches`,
      BoardGrade: "150 GSM Premium Fluting",
      Color: "Natural Kraft Brown",
    },
    rating: 5.0,
    reviewsCount: 24,
    isPopular: true,
    offerBadge: (p.seoTitle && p.seoTitle.startsWith("OFFER:"))
      ? p.seoTitle.replace("OFFER:", "").split("|")[0] || ""
      : (v50 && v50.mrpPaise > v50.sellingPricePaise)
        ? `-${Math.round(((v50.mrpPaise - v50.sellingPricePaise) / v50.mrpPaise) * 100)}%`
        : "",
    offerDiscountPercent: (p.seoTitle && p.seoTitle.startsWith("OFFER:"))
      ? Number(p.seoTitle.replace("OFFER:", "").split("|")[1]) || 0
      : (v50 && v50.mrpPaise > v50.sellingPricePaise)
        ? Math.round(((v50.mrpPaise - v50.sellingPricePaise) / v50.mrpPaise) * 100)
        : 0,
    status: p.status,
    variants: (p.variants || []).map((v: any) => ({
      id: v.id,
      sku: v.sku,
      lengthIn: v.lengthIn,
      widthIn: v.widthIn,
      heightIn: v.heightIn,
      material: v.material,
      packQuantity: v.packQuantity,
      mrpPaise: v.mrpPaise,
      sellingPricePaise: v.sellingPricePaise,
      stockQuantity: v.stockQuantity,
    })),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function getDbProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  status?: ProductStatus;
  search?: string;
}) {
  const where: any = {};

  if (options?.status) {
    where.status = options.status;
  }
  if (options?.categoryId) {
    where.categoryId = options.categoryId;
  }
  if (options?.categorySlug) {
    where.OR = [
      { category: { slug: options.categorySlug } },
      { category: { id: options.categorySlug } },
      { categoryId: options.categorySlug },
    ];
  }
  if (options?.search?.trim()) {
    const q = options.search.trim();
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { packQuantity: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return products.map(formatPrismaProduct);
}

export async function getDbProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { packQuantity: "asc" } },
    },
  });

  if (!product) return null;
  return formatPrismaProduct(product);
}

export async function getDbProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { packQuantity: "asc" } },
    },
  });

  if (!product) return null;
  return formatPrismaProduct(product);
}

export interface CreateProductInput {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  status?: ProductStatus;
  seoTitle?: string;
  seoDescription?: string;
  imageUrl?: string;
  lengthIn?: number;
  widthIn?: number;
  heightIn?: number;
  material?: string;
  price50?: number;
  price100?: number;
  price300?: number;
  price500?: number;
  stockQuantity?: number;
}

export async function createDbProduct(input: CreateProductInput) {
  const lengthIn = input.lengthIn || 6;
  const widthIn = input.widthIn || 4;
  const heightIn = input.heightIn || 2;
  const material = input.material || "3-Ply Single Wall E-Flute";
  const stock = input.stockQuantity || 100;

  const p50 = input.price50 || 250;
  const p100 = input.price100 || Math.round(p50 * 1.9);
  const p300 = input.price300 || Math.round(p50 * 5.4);
  const p500 = input.price500 || Math.round(p50 * 8.5);

  const product = await prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      categoryId: input.categoryId,
      description: input.description,
      status: input.status || "ACTIVE",
      seoTitle: input.seoTitle || `${input.name} | Box Care`,
      seoDescription: input.seoDescription || input.description,
      images: {
        create: [
          {
            url: input.imageUrl || "/images/box_4_4_1_5.png",
            altText: input.name,
            sortOrder: 0,
            updatedAt: new Date(),
          },
        ],
      },
      variants: {
        create: [
          {
            sku: `${input.slug}-50`,
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
            sku: `${input.slug}-100`,
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
            sku: `${input.slug}-300`,
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
            sku: `${input.slug}-500`,
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

  return formatPrismaProduct(product);
}

export async function updateDbProduct(id: string, input: Partial<CreateProductInput>) {
  const existing = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: true },
  });

  if (!existing) {
    throw new Error(`Product with id ${id} not found`);
  }

  const lengthIn = input.lengthIn !== undefined ? input.lengthIn : existing.variants[0]?.lengthIn || 6;
  const widthIn = input.widthIn !== undefined ? input.widthIn : existing.variants[0]?.widthIn || 4;
  const heightIn = input.heightIn !== undefined ? input.heightIn : existing.variants[0]?.heightIn || 2;
  const material = input.material || existing.variants[0]?.material || "3-Ply Single Wall";

  // Update base product
  await prisma.product.update({
    where: { id },
    data: {
      name: input.name !== undefined ? input.name : existing.name,
      slug: input.slug !== undefined ? input.slug : existing.slug,
      categoryId: input.categoryId !== undefined ? input.categoryId : existing.categoryId,
      description: input.description !== undefined ? input.description : existing.description,
      status: input.status !== undefined ? input.status : existing.status,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle : existing.seoTitle,
      seoDescription: input.seoDescription !== undefined ? input.seoDescription : existing.seoDescription,
    },
  });

  // Update image if provided
  if (input.imageUrl) {
    if (existing.images.length > 0) {
      await prisma.productImage.update({
        where: { id: existing.images[0].id },
        data: { url: input.imageUrl, updatedAt: new Date() },
      });
    } else {
      await prisma.productImage.create({
        data: {
          productId: id,
          url: input.imageUrl,
          altText: existing.name,
          sortOrder: 0,
          updatedAt: new Date(),
        },
      });
    }
  }

  // Update tier variants
  const packTiers = [
    { qty: 50, price: input.price50 },
    { qty: 100, price: input.price100 },
    { qty: 300, price: input.price300 },
    { qty: 500, price: input.price500 },
  ];

  for (const tier of packTiers) {
    const existingVariant = existing.variants.find((v) => v.packQuantity === tier.qty);
    if (existingVariant) {
      const pricePaise = tier.price !== undefined ? tier.price * 100 : existingVariant.sellingPricePaise;
      await prisma.productVariant.update({
        where: { id: existingVariant.id },
        data: {
          lengthIn,
          widthIn,
          heightIn,
          material,
          sellingPricePaise: pricePaise,
          mrpPaise: Math.round(pricePaise * 1.2),
          stockQuantity: input.stockQuantity !== undefined ? input.stockQuantity : existingVariant.stockQuantity,
        },
      });
    }
  }

  const updated = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });

  return formatPrismaProduct(updated);
}

export async function deleteDbProduct(id: string) {
  // Safe deletion rule: Never permanently delete products referenced by historical order items!
  const referencedCount = await prisma.orderItem.count({
    where: {
      variant: {
        productId: id,
      },
    },
  });

  if (referencedCount > 0) {
    // Soft delete: mark INACTIVE
    await prisma.product.update({
      where: { id },
      data: { status: "INACTIVE" },
    });
    return { success: true, softDeleted: true, message: "Product is referenced in historical orders and was safely marked INACTIVE." };
  }

  // Safe to delete if never ordered
  await prisma.product.delete({
    where: { id },
  });

  return { success: true, softDeleted: false, message: "Product removed from database successfully." };
}

export async function toggleDbProductStatus(id: string, status: ProductStatus) {
  const updated = await prisma.product.update({
    where: { id },
    data: { status },
    include: {
      category: true,
      images: true,
      variants: true,
    },
  });

  return formatPrismaProduct(updated);
}
