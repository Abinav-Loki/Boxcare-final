"use server";

import { revalidatePath } from "next/cache";
import { updateOrderStatusSchema, updatePaymentStatusSchema } from "@/lib/validation/order";
import {
  getDbOrders,
  getDbOrderById,
  updateDbOrderStatus,
  overrideDbOrderPaymentStatus,
} from "@/lib/db/orders";
import { OrderStatus, PaymentStatus } from "@/generated/prisma/client";

export async function getAdminOrdersAction(options?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  take?: number;
}) {
  try {
    const orders = await getDbOrders(options);
    return { success: true, data: orders };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load orders" };
  }
}

export async function getAdminOrderByIdAction(id: string) {
  try {
    const order = await getDbOrderById(id);
    return { success: true, data: order };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load order" };
  }
}

export async function updateOrderStatusAction(id: string, rawInput: unknown) {
  try {
    const validated = updateOrderStatusSchema.parse(rawInput);
    const updated = await updateDbOrderStatus(id, validated.status, validated.notes);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/profile");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update order status" };
  }
}

export async function overrideOrderPaymentStatusAction(id: string, rawInput: unknown) {
  try {
    const validated = updatePaymentStatusSchema.parse(rawInput);
    const updated = await overrideDbOrderPaymentStatus(
      id,
      validated.paymentStatus,
      validated.overrideReason
    );

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/dashboard");
    revalidatePath("/profile");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to override payment status" };
  }
}
