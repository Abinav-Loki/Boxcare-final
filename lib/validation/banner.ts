import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().trim().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, "Image URL is required"),
  linkUrl: z.string().trim().optional(),
  location: z.string().trim().default("HOME_HERO"),
  sortOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;
