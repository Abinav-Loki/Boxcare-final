import { z } from "zod";
import { orderStatuses, paymentStatuses, shipmentStatuses } from "../constants";

export const orderStatusSchema = z.enum(orderStatuses);
export const paymentStatusSchema = z.enum(paymentStatuses);
export const shipmentStatusSchema = z.enum(shipmentStatuses);

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
  notes: z.string().trim().optional(),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: paymentStatusSchema,
  overrideReason: z.string().trim().min(3, "Override reason is required"),
});
