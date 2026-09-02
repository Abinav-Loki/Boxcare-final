import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email(),
  phone: z.string().trim().min(8),
  fullName: z.string().trim().min(2),
  addressLine1: z.string().trim().min(3),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z.string().trim().regex(/^[1-9][0-9]{5}$/),
  companyName: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),
  couponCode: z.string().trim().optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
