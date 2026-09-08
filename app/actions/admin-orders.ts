"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { updateOrderStatusSchema, updatePaymentStatusSchema } from "@/lib/validation/order";
import { getDbOrders, getDbOrderById } from "@/lib/db/orders";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminOrdersAction(options?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  take?: number;
}) {
  try {
    const orders = await getDbOrders(options);
    return { success: true, data: orders };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load orders";
    return { success: false, error: errorMsg };
  }
}

export async function getAdminOrderByIdAction(id: string) {
  try {
    const order = await getDbOrderById(id);
    return { success: true, data: order };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load order";
    return { success: false, error: errorMsg };
  }
}

export async function updateOrderStatusAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const inputObj = typeof rawInput === "string" ? { status: rawInput } : rawInput;
    const validated = updateOrderStatusSchema.parse(inputObj);

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      orderNumber: existing.orderNumber,
      status: existing.status,
      paymentStatus: existing.paymentStatus,
      shipmentStatus: existing.shipmentStatus,
      notes: existing.notes,
    };

    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { id },
        data: {
          status: validated.status,
          notes: validated.notes !== undefined ? validated.notes : existing.notes,
        },
        include: {
          items: true,
          payment: true,
          shipment: true,
        },
      });

      const afterSnapshot = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shipmentStatus: order.shipmentStatus,
        notes: order.notes,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "ORDERS",
        action: "STATUS_CHANGE",
        entityType: "Order",
        entityId: order.id,
        entityName: `Order #${order.orderNumber}`,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return order;
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/activity");
    revalidatePath("/profile");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update order status";
    return { success: false, error: errorMsg };
  }
}

export async function overrideOrderPaymentStatusAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const validated = updatePaymentStatusSchema.parse(rawInput);

    const existing = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      orderNumber: existing.orderNumber,
      status: existing.status,
      paymentStatus: existing.paymentStatus,
    };

    const updated = await prisma.$transaction(async (tx) => {
      let newOrderStatus: OrderStatus = existing.status;
      if (validated.paymentStatus === PaymentStatus.SUCCESS && existing.status === OrderStatus.PENDING_PAYMENT) {
        newOrderStatus = OrderStatus.PAYMENT_CONFIRMED;
      }

      const order = await tx.order.update({
        where: { id },
        data: {
          paymentStatus: validated.paymentStatus,
          status: newOrderStatus,
        },
      });

      const afterSnapshot = {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "ORDERS",
        action: "STATUS_CHANGE",
        entityType: "Order",
        entityId: order.id,
        entityName: `Order #${order.orderNumber} (Payment Override)`,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return order;
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/activity");
    revalidatePath("/profile");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to override payment status";
    return { success: false, error: errorMsg };
  }
}
