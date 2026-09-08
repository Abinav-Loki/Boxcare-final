import { z } from "zod";

export const pageContentSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  content: z.string().default("{}"),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;
