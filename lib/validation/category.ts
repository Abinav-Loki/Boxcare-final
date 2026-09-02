import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  parentId: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().url().optional(),
  sortOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
