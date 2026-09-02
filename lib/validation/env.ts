import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  AUTH_SECRET: z.string().min(16, "AUTH_SECRET must be at least 16 characters"),
  AUTH_URL: z.string().url().default("http://localhost:3000"),
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  CCAVENUE_MERCHANT_ID: z.string().optional(),
  CCAVENUE_ACCESS_CODE: z.string().optional(),
  CCAVENUE_WORKING_KEY: z.string().optional(),
  CCAVENUE_MODE: z.enum(["test", "live"]).default("test"),
  CCAVENUE_REDIRECT_URL: z.string().url(),
  CCAVENUE_CANCEL_URL: z.string().url(),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  STORAGE_PROVIDER: z.enum(["local", "cloudinary", "s3"]).default("local"),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(input = process.env) {
  return envSchema.parse(input);
}
