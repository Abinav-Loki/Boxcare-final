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
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  categoryId: z.string().trim().min(1),
  description: z.string().trim().optional(),
  status: productStatusSchema.default("DRAFT"),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  variants: z.array(productVariantSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
