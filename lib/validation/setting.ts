import { z } from "zod";

export const settingSchema = z.object({
  key: z.string().trim().min(1, "Key is required"),
  value: z.string(),
  description: z.string().optional().nullable(),
});

export const settingsSchema = z.record(z.string(), z.string());

export type SettingInput = z.infer<typeof settingSchema>;

