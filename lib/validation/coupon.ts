import { z } from "zod";

export const discountTypeSchema = z.enum(["PERCENTAGE", "FLAT"]);

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, "Code must be at least 3 characters")
    .toUpperCase(),
  discountType: discountTypeSchema,
  discountValue: z.number().int().positive("Discount value must be positive"),
  minOrderPaise: z.number().int().nonnegative().default(0),
  maxDiscountPaise: z.number().int().positive().optional().nullable(),
  startDate: z.date().optional().nullable(),
  endDate: z.date().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CouponInput = z.infer<typeof couponSchema>;
