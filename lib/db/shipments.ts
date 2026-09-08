import { prisma } from "./prisma";
import { ShipmentStatus } from "@/generated/prisma/client";

export interface FormattedShipment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  courierPartner: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  status: ShipmentStatus;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  notes: string | null;
  itemsCount: number;
  totalRupees: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getDbShipments() {
  const shipments = await prisma.shipment.findMany({
    include: {
      order: {
        include: {
          items: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return shipments.map((s) => ({
    id: s.id,
    orderId: s.orderId,
    orderNumber: s.order.orderNumber,
    customerName: s.order.customerName,
    customerPhone: s.order.customerPhone,
    shippingAddress: [s.order.addressLine1, s.order.city, s.order.state, s.order.pincode].filter(Boolean).join(", "),
    courierPartner: s.courierPartner,
    trackingNumber: s.trackingNumber,
    trackingUrl: s.trackingUrl,
    status: s.status,
    shippedAt: s.shippedAt,
    deliveredAt: s.deliveredAt,
    notes: s.notes,
    itemsCount: s.order.items.reduce((acc, it) => acc + it.quantity, 0),
    totalRupees: Math.round(s.order.totalPaise / 100),
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
}

export interface CreateShipmentInput {
  orderId: string;
  courierPartner?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  status?: ShipmentStatus;
  notes?: string | null;
}

export async function createDbShipment(input: CreateShipmentInput) {
  const status = input.status || "NOT_SHIPPED";
  const shippedAt = status === "SHIPPED" || status === "OUT_FOR_DELIVERY" || status === "DELIVERED" ? new Date() : null;
  const deliveredAt = status === "DELIVERED" ? new Date() : null;

  const shipment = await prisma.shipment.create({
    data: {
      orderId: input.orderId,
      courierPartner: input.courierPartner || null,
      trackingNumber: input.trackingNumber || null,
      trackingUrl: input.trackingUrl || null,
      status,
      shippedAt,
      deliveredAt,
      notes: input.notes || null,
    },
  });

  // Sync order's shipmentStatus
  await prisma.order.update({
    where: { id: input.orderId },
    data: { shipmentStatus: status },
  });

  return shipment;
}

export async function updateDbShipment(id: string, input: Partial<CreateShipmentInput>) {
  const existing = await prisma.shipment.findUnique({ where: { id } });
  if (!existing) throw new Error(`Shipment with id ${id} not found`);

  const status = input.status || existing.status;
  const shippedAt = (status === "SHIPPED" || status === "OUT_FOR_DELIVERY" || status === "DELIVERED") && !existing.shippedAt
    ? new Date()
    : existing.shippedAt;
  const deliveredAt = status === "DELIVERED" && !existing.deliveredAt ? new Date() : existing.deliveredAt;

  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      courierPartner: input.courierPartner !== undefined ? input.courierPartner : existing.courierPartner,
      trackingNumber: input.trackingNumber !== undefined ? input.trackingNumber : existing.trackingNumber,
      trackingUrl: input.trackingUrl !== undefined ? input.trackingUrl : existing.trackingUrl,
      status,
      shippedAt,
      deliveredAt,
      notes: input.notes !== undefined ? input.notes : existing.notes,
    },
  });

  // Sync order's shipmentStatus
  await prisma.order.update({
    where: { id: existing.orderId },
    data: { shipmentStatus: status },
  });

  return updated;
}
