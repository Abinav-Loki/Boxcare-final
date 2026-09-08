"use server";

import { revalidatePath } from "next/cache";
import {
  getDbShipments,
  createDbShipment,
  updateDbShipment,
  CreateShipmentInput,
} from "@/lib/db/shipments";
import { shipmentSchema, updateShipmentSchema, shipmentStatusSchema } from "@/lib/validation";

export async function getAdminShipmentsAction() {
  try {
    const shipments = await getDbShipments();
    return { success: true, data: shipments };
  } catch (error: any) {
    console.error("Error fetching shipments:", error);
    return { success: false, error: error.message || "Failed to fetch shipments" };
  }
}

export async function createAdminShipmentAction(rawInput: CreateShipmentInput) {
  try {
    const validated = shipmentSchema.parse(rawInput);
    const shipment = await createDbShipment(validated as any);
    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true, data: shipment };
  } catch (error: any) {
    console.error("Error creating shipment:", error);
    return { success: false, error: error.message || "Failed to create shipment" };
  }
}

export async function updateAdminShipmentAction(id: string, rawInput: Partial<CreateShipmentInput>) {
  try {
    const shipment = await updateDbShipment(id, rawInput);
    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true, data: shipment };
  } catch (error: any) {
    console.error("Error updating shipment:", error);
    return { success: false, error: error.message || "Failed to update shipment" };
  }
}

export async function updateAdminShipmentStatusAction(id: string, status: any) {
  try {
    const validatedStatus = shipmentStatusSchema.parse(status);
    const shipment = await updateDbShipment(id, { status: validatedStatus as any });
    revalidatePath("/admin/shipments");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/dashboard");
    return { success: true, data: shipment };
  } catch (error: any) {
    console.error("Error updating shipment status:", error);
    return { success: false, error: error.message || "Failed to update shipment status" };
  }
}
