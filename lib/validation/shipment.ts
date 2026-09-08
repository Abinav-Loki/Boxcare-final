import { z } from "zod";
import { shipmentStatuses } from "../constants";

export const shipmentStatusSchema = z.enum(shipmentStatuses);

export const shipmentSchema = z.object({
  orderId: z.string().trim().min(1, "Order ID is required"),
  courierPartner: z.string().trim().optional().nullable(),
  trackingNumber: z.string().trim().optional().nullable(),
  trackingUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  status: shipmentStatusSchema.default("NOT_SHIPPED"),
  notes: z.string().trim().optional().nullable(),
});

export const updateShipmentSchema = z.object({
  courierPartner: z.string().trim().optional().nullable(),
  trackingNumber: z.string().trim().optional().nullable(),
  trackingUrl: z.string().trim().url().optional().nullable().or(z.literal("")),
  status: shipmentStatusSchema,
  notes: z.string().trim().optional().nullable(),
});

export type ShipmentInput = z.infer<typeof shipmentSchema>;
