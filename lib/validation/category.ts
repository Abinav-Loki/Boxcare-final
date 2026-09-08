import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
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
  parentId: z.string().trim().optional().nullable().transform((v) => v || null),
  description: z.string().trim().optional().nullable().transform((v) => v || null),
  imageUrl: z.string().trim().optional().nullable().transform((v) => v || null),
  sortOrder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().trim().optional().nullable().transform((v) => v || null),
  seoDescription: z.string().trim().optional().nullable().transform((v) => v || null),
});

export type CategoryInput = z.infer<typeof categorySchema>;

