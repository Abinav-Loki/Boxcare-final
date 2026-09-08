"use server";

import { revalidatePath } from "next/cache";
import { couponSchema } from "@/lib/validation/coupon";
import {
  getDbCoupons,
  createDbCoupon,
  updateDbCoupon,
  deleteDbCoupon,
  toggleDbCouponActive,
} from "@/lib/db/coupons";

export async function getAdminCouponsAction() {
  try {
    const coupons = await getDbCoupons();
    return { success: true, data: coupons };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load coupons" };
  }
}

export async function createAdminCouponAction(rawInput: unknown) {
  try {
    const validated = couponSchema.parse(rawInput);
    const created = await createDbCoupon(validated);

    revalidatePath("/admin/coupons");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: created };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create coupon" };
  }
}

export async function updateAdminCouponAction(id: string, rawInput: unknown) {
  try {
    const schema = couponSchema.partial();
    const validated = schema.parse(rawInput);
    const updated = await updateDbCoupon(id, validated);

    revalidatePath("/admin/coupons");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update coupon" };
  }
}

export async function deleteAdminCouponAction(id: string) {
  try {
    await deleteDbCoupon(id);

    revalidatePath("/admin/coupons");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete coupon" };
  }
}

export async function toggleCouponActiveAction(id: string, isActive: boolean) {
  try {
    const updated = await toggleDbCouponActive(id, isActive);

    revalidatePath("/admin/coupons");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle coupon" };
  }
}
