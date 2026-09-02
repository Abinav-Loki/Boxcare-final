import { z } from "zod";
import { navigationItemTypes, navigationLocations } from "@/lib/navigation/types";

export const navigationItemSchema = z.object({
  label: z.string().trim().min(1),
  location: z.enum(navigationLocations),
  type: z.enum(navigationItemTypes),
  destination: z.string().trim().min(1),
  sortOrder: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export type NavigationItemInput = z.infer<typeof navigationItemSchema>;
