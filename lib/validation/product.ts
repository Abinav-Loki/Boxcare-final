import { z } from "zod";

export const productStatusSchema = z.enum(["DRAFT", "ACTIVE", "INACTIVE"]);

export const productVariantSchema = z.object({
  sku: z.string().trim().optional(),
  lengthIn: z.number().positive().optional(),
  widthIn: z.number().positive().optional(),
  heightIn: z.number().positive().optional(),
  material: z.string().trim().min(1),
  packQuantity: z.number().int().positive(),
  mrpPaise: z.number().int().nonnegative(),
  sellingPricePaise: z.number().int().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
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
  categoryId: z.string().trim().min(1),
  description: z.string().trim().optional().nullable(),
  status: productStatusSchema.default("DRAFT"),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
  variants: z.array(productVariantSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;

