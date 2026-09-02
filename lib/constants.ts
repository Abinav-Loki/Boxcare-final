export const adminRoles = ["SUPER_ADMIN", "OPERATIONS", "CATALOG"] as const;

export const orderStatuses = [
  "PENDING_PAYMENT",
  "PAYMENT_FAILED",
  "PAYMENT_CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
  "REFUNDED",
] as const;

export const paymentStatuses = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const shipmentStatuses = [
  "NOT_SHIPPED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED",
] as const;

export type AdminRole = (typeof adminRoles)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type ShipmentStatus = (typeof shipmentStatuses)[number];
