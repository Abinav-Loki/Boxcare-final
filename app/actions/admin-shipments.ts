"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import {
  getDbShipments,
  CreateShipmentInput,
} from "@/lib/db/shipments";
import { shipmentSchema, shipmentStatusSchema } from "@/lib/validation";
import { ShipmentStatus, OrderStatus } from "@/generated/prisma/client";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminShipmentsAction() {
  try {
    const shipments = await getDbShipments();
    return { success: true, data: shipments };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to fetch shipments";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminShipmentAction(rawInput: CreateShipmentInput, commitNote?: string) {
  try {
    const validated = shipmentSchema.parse(rawInput);

    const shipment = await prisma.$transaction(async (tx) => {
      const created = await tx.shipment.create({
        data: {
          orderId: validated.orderId,
          courierPartner: validated.courierPartner || null,
          trackingNumber: validated.trackingNumber || null,
          trackingUrl: validated.trackingUrl || null,
          status: (validated.status as ShipmentStatus) || ShipmentStatus.NOT_SHIPPED,
          notes: validated.notes || null,
          shippedAt: validated.status === ShipmentStatus.SHIPPED ? new Date() : null,
          deliveredAt: validated.status === ShipmentStatus.DELIVERED ? new Date() : null,
        },
      });

      if (validated.status) {
        await tx.order.update({
          where: { id: validated.orderId },
          data: {
            shipmentStatus: validated.status as ShipmentStatus,
            status:
              validated.status === ShipmentStatus.DELIVERED
                ? OrderStatus.DELIVERED
                : validated.status === ShipmentStatus.SHIPPED || validated.status === ShipmentStatus.OUT_FOR_DELIVERY
                ? OrderStatus.SHIPPED
                : undefined,
          },
        });
      }

      await logAdminActivity({
        tx: tx as any,
        module: "SHIPMENTS",
        action: "CREATE",
        entityType: "Shipment",
        entityId: created.id,
        entityName: created.trackingNumber || `Shipment for order ${created.orderId}`,
        commitNote,
        beforeData: null,
        afterData: created,
      });

      return created;
    });

    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/activity");

    return { success: true, data: shipment };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to create shipment";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminShipmentAction(id: string, rawInput: Partial<CreateShipmentInput>, commitNote?: string) {
  try {
    const existing = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Shipment not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      orderId: existing.orderId,
      courierPartner: existing.courierPartner,
      trackingNumber: existing.trackingNumber,
      trackingUrl: existing.trackingUrl,
      status: existing.status,
      notes: existing.notes,
    };

    const shipment = await prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id },
        data: {
          courierPartner: rawInput.courierPartner !== undefined ? rawInput.courierPartner : undefined,
          trackingNumber: rawInput.trackingNumber !== undefined ? rawInput.trackingNumber : undefined,
          trackingUrl: rawInput.trackingUrl !== undefined ? rawInput.trackingUrl : undefined,
          status: rawInput.status ? (rawInput.status as ShipmentStatus) : undefined,
          notes: rawInput.notes !== undefined ? rawInput.notes : undefined,
          shippedAt: rawInput.status === ShipmentStatus.SHIPPED && !existing.shippedAt ? new Date() : undefined,
          deliveredAt: rawInput.status === ShipmentStatus.DELIVERED && !existing.deliveredAt ? new Date() : undefined,
        },
      });

      if (rawInput.status) {
        await tx.order.update({
          where: { id: existing.orderId },
          data: {
            shipmentStatus: rawInput.status as ShipmentStatus,
            status:
              rawInput.status === ShipmentStatus.DELIVERED
                ? OrderStatus.DELIVERED
                : rawInput.status === ShipmentStatus.SHIPPED || rawInput.status === ShipmentStatus.OUT_FOR_DELIVERY
                ? OrderStatus.SHIPPED
                : undefined,
          },
        });
      }

      const afterSnapshot = {
        id: updated.id,
        orderId: updated.orderId,
        courierPartner: updated.courierPartner,
        trackingNumber: updated.trackingNumber,
        trackingUrl: updated.trackingUrl,
        status: updated.status,
        notes: updated.notes,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "SHIPMENTS",
        action: "UPDATE",
        entityType: "Shipment",
        entityId: updated.id,
        entityName: updated.trackingNumber || `Shipment for order ${updated.orderId}`,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return updated;
    });

    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/activity");

    return { success: true, data: shipment };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update shipment";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminShipmentStatusAction(id: string, status: unknown, commitNote?: string) {
  try {
    const validatedStatus = shipmentStatusSchema.parse(status) as ShipmentStatus;

    const existing = await prisma.shipment.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Shipment not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      orderId: existing.orderId,
      status: existing.status,
    };

    const shipment = await prisma.$transaction(async (tx) => {
      const updated = await tx.shipment.update({
        where: { id },
        data: {
          status: validatedStatus,
          shippedAt: validatedStatus === ShipmentStatus.SHIPPED && !existing.shippedAt ? new Date() : undefined,
          deliveredAt: validatedStatus === ShipmentStatus.DELIVERED && !existing.deliveredAt ? new Date() : undefined,
        },
      });

      await tx.order.update({
        where: { id: existing.orderId },
        data: {
          shipmentStatus: validatedStatus,
          status:
            validatedStatus === ShipmentStatus.DELIVERED
              ? OrderStatus.DELIVERED
              : validatedStatus === ShipmentStatus.SHIPPED || validatedStatus === ShipmentStatus.OUT_FOR_DELIVERY
              ? OrderStatus.SHIPPED
              : undefined,
        },
      });

      const afterSnapshot = {
        id: updated.id,
        orderId: updated.orderId,
        status: updated.status,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "SHIPMENTS",
        action: "STATUS_CHANGE",
        entityType: "Shipment",
        entityId: updated.id,
        entityName: updated.trackingNumber || `Shipment for order ${updated.orderId}`,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return updated;
    });

    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/activity");

    return { success: true, data: shipment };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to update shipment status";
    return { success: false, error: errorMsg };
  }
}
