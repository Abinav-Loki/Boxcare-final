import { z } from "zod";

export const customerSignUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be under 100 characters"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
    phone: z
      .string()
      .trim()
      .optional()
      .refine((val) => !val || /^[0-9+ -]{8,20}$/.test(val), {
        message: "Please enter a valid phone number",
      }),
    companyName: z.string().trim().max(100).optional(),
    gstNumber: z.string().trim().max(20).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CustomerSignUpInput = z.infer<typeof customerSignUpSchema>;

export const customerSignInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type CustomerSignInInput = z.infer<typeof customerSignInSchema>;

export const customerProfileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100)
    .optional(),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || /^[0-9+ -]{8,20}$/.test(val), {
      message: "Please enter a valid phone number",
    }),
  companyName: z.string().trim().max(100).optional(),
  gstNumber: z.string().trim().max(20).optional(),
  avatarUrl: z.string().trim().url().optional().or(z.literal("")),
});

export type CustomerProfileUpdateInput = z.infer<typeof customerProfileUpdateSchema>;

export const customerAddressInputSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required"),
  phone: z
    .string()
    .trim()
    .min(8, "Phone must be at least 8 digits")
    .regex(/^[0-9+ -]{8,20}$/, "Invalid phone format"),
  email: z.string().trim().email("Invalid email"),
  addressLine1: z.string().trim().min(3, "Address line 1 is required"),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Pincode must be a 6-digit Indian PIN code"),
  companyName: z.string().trim().optional(),
  gstNumber: z.string().trim().optional(),
  isDefault: z.boolean().optional().default(false),
});

export type CustomerAddressInput = z.infer<typeof customerAddressInputSchema>;

export const customerForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase(),
});

export type CustomerForgotPasswordInput = z.infer<typeof customerForgotPasswordSchema>;

export const customerResetPasswordSchema = z
  .object({
    token: z.string().trim().min(10, "Reset token is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CustomerResetPasswordInput = z.infer<typeof customerResetPasswordSchema>;

export interface SanitizedCustomer {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  companyName: string | null;
  gstNumber: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
}
