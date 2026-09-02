import { z } from "zod";

export const cartItemSchema = z.object({
  variantId: z.string().trim().min(1),
  quantity: z.number().int().positive(),
});

export const updateCartItemSchema = z.object({
  cartItemId: z.string().trim().min(1),
  quantity: z.number().int().nonnegative(),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
