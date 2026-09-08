import { z } from "zod";

export const pageContentSchema = z.object({
  slug: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      if (!val) return "home";
      return val.trim().replace(/^\/+|\/+$/g, "");
    }),
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().default("{}"),
  seoTitle: z.string().trim().optional().nullable(),
  seoDescription: z.string().trim().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type PageContentInput = z.infer<typeof pageContentSchema>;

