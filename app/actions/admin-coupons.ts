"use server";

import { safeRevalidatePath as revalidatePath } from "@/lib/utils/revalidate";
import { prisma } from "@/lib/db/prisma";
import { couponSchema } from "@/lib/validation/coupon";
import { getDbCoupons } from "@/lib/db/coupons";
import { logAdminActivity } from "@/lib/audit/activity-logger";

export async function getAdminCouponsAction() {
  try {
    const coupons = await getDbCoupons();
    return { success: true, data: coupons };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to load coupons";
    return { success: false, error: errorMsg };
  }
}

export async function createAdminCouponAction(rawInput: unknown, commitNote?: string) {
  try {
    const validated = couponSchema.parse(rawInput);

    const created = await prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.create({
        data: {
          code: validated.code.toUpperCase(),
          discountType: validated.discountType,
          discountValue: validated.discountValue,
          minOrderPaise: validated.minOrderPaise || 0,
          maxDiscountPaise: validated.maxDiscountPaise || null,
          startDate: validated.startDate ? new Date(validated.startDate) : null,
          endDate: validated.endDate ? new Date(validated.endDate) : null,
          usageLimit: validated.usageLimit || null,
          isActive: validated.isActive !== undefined ? validated.isActive : true,
        },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "COUPONS",
        action: "CREATE",
        entityType: "Coupon",
        entityId: coupon.id,
        entityName: coupon.code,
        commitNote,
        beforeData: null,
        afterData: coupon,
      });

      return coupon;
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/activity");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: created };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create coupon";
    return { success: false, error: errorMsg };
  }
}

export async function updateAdminCouponAction(id: string, rawInput: unknown, commitNote?: string) {
  try {
    const schema = couponSchema.partial();
    const validated = schema.parse(rawInput);

    const existing = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Coupon not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      code: existing.code,
      discountType: existing.discountType,
      discountValue: existing.discountValue,
      minOrderPaise: existing.minOrderPaise,
      maxDiscountPaise: existing.maxDiscountPaise,
      startDate: existing.startDate,
      endDate: existing.endDate,
      usageLimit: existing.usageLimit,
      isActive: existing.isActive,
    };

    const updated = await prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.update({
        where: { id },
        data: {
          code: validated.code !== undefined ? validated.code.toUpperCase() : undefined,
          discountType: validated.discountType !== undefined ? validated.discountType : undefined,
          discountValue: validated.discountValue !== undefined ? validated.discountValue : undefined,
          minOrderPaise: validated.minOrderPaise !== undefined ? validated.minOrderPaise : undefined,
          maxDiscountPaise: validated.maxDiscountPaise !== undefined ? validated.maxDiscountPaise : undefined,
          startDate: validated.startDate !== undefined ? (validated.startDate ? new Date(validated.startDate) : null) : undefined,
          endDate: validated.endDate !== undefined ? (validated.endDate ? new Date(validated.endDate) : null) : undefined,
          usageLimit: validated.usageLimit !== undefined ? validated.usageLimit : undefined,
          isActive: validated.isActive !== undefined ? validated.isActive : undefined,
        },
      });

      const afterSnapshot = {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderPaise: coupon.minOrderPaise,
        maxDiscountPaise: coupon.maxDiscountPaise,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        usageLimit: coupon.usageLimit,
        isActive: coupon.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "COUPONS",
        action: "UPDATE",
        entityType: "Coupon",
        entityId: coupon.id,
        entityName: coupon.code,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return coupon;
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/activity");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update coupon";
    return { success: false, error: errorMsg };
  }
}

export async function deleteAdminCouponAction(id: string, commitNote?: string) {
  try {
    const existing = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Coupon not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      code: existing.code,
      discountType: existing.discountType,
      discountValue: existing.discountValue,
      isActive: existing.isActive,
    };

    await prisma.$transaction(async (tx) => {
      await tx.coupon.delete({
        where: { id },
      });

      await logAdminActivity({
        tx: tx as any,
        module: "COUPONS",
        action: "DELETE",
        entityType: "Coupon",
        entityId: id,
        entityName: existing.code,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: null,
      });
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/activity");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete coupon";
    return { success: false, error: errorMsg };
  }
}

export async function toggleCouponActiveAction(id: string, isActive: boolean, commitNote?: string) {
  try {
    const existing = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: "Coupon not found" };
    }

    const beforeSnapshot = {
      id: existing.id,
      code: existing.code,
      isActive: existing.isActive,
    };

    const action = isActive ? "ACTIVATE" : "DEACTIVATE";

    const updated = await prisma.$transaction(async (tx) => {
      const coupon = await tx.coupon.update({
        where: { id },
        data: { isActive },
      });

      const afterSnapshot = {
        id: coupon.id,
        code: coupon.code,
        isActive: coupon.isActive,
      };

      await logAdminActivity({
        tx: tx as any,
        module: "COUPONS",
        action,
        entityType: "Coupon",
        entityId: id,
        entityName: coupon.code,
        commitNote,
        beforeData: beforeSnapshot,
        afterData: afterSnapshot,
      });

      return coupon;
    });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/activity");
    revalidatePath("/cart");
    revalidatePath("/checkout");

    return { success: true, data: updated };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to toggle coupon";
    return { success: false, error: errorMsg };
  }
}
