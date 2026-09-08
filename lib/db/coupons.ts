import { prisma } from "./prisma";
import { DiscountType } from "@/generated/prisma/client";

export interface FormattedCoupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderPaise: number;
  minOrderRupees: number;
  maxDiscountPaise: number | null;
  maxDiscountRupees: number | null;
  startDate: Date | null;
  endDate: Date | null;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  ordersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export function formatPrismaCoupon(c: any): FormattedCoupon {
  return {
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minOrderPaise: c.minOrderPaise,
    minOrderRupees: Math.round(c.minOrderPaise / 100),
    maxDiscountPaise: c.maxDiscountPaise,
    maxDiscountRupees: c.maxDiscountPaise ? Math.round(c.maxDiscountPaise / 100) : null,
    startDate: c.startDate,
    endDate: c.endDate,
    usageLimit: c.usageLimit,
    usedCount: c.usedCount,
    isActive: c.isActive,
    ordersCount: c._count?.orders || c.orders?.length || 0,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function getDbCoupons() {
  const coupons = await prisma.coupon.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return coupons.map(formatPrismaCoupon);
}

export interface CreateCouponInput {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderPaise?: number;
  minOrderRupees?: number;
  maxDiscountPaise?: number | null;
  maxDiscountRupees?: number | null;
  startDate?: Date | null;
  endDate?: Date | null;
  usageLimit?: number | null;
  isActive?: boolean;
}

export async function createDbCoupon(input: CreateCouponInput) {
  const minOrderPaise = input.minOrderPaise !== undefined
    ? input.minOrderPaise
    : (input.minOrderRupees ? input.minOrderRupees * 100 : 0);

  const maxDiscountPaise = input.maxDiscountPaise !== undefined
    ? input.maxDiscountPaise
    : (input.maxDiscountRupees ? input.maxDiscountRupees * 100 : null);

  const coupon = await prisma.coupon.create({
    data: {
      code: input.code.trim().toUpperCase(),
      discountType: input.discountType,
      discountValue: input.discountValue,
      minOrderPaise,
      maxDiscountPaise,
      startDate: input.startDate,
      endDate: input.endDate,
      usageLimit: input.usageLimit,
      isActive: input.isActive !== undefined ? input.isActive : true,
    },
  });

  return formatPrismaCoupon(coupon);
}

export async function updateDbCoupon(id: string, input: Partial<CreateCouponInput>) {
  const minOrderPaise = input.minOrderPaise !== undefined
    ? input.minOrderPaise
    : (input.minOrderRupees !== undefined ? input.minOrderRupees * 100 : undefined);

  const maxDiscountPaise = input.maxDiscountPaise !== undefined
    ? input.maxDiscountPaise
    : (input.maxDiscountRupees !== undefined ? (input.maxDiscountRupees ? input.maxDiscountRupees * 100 : null) : undefined);

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: input.code ? input.code.trim().toUpperCase() : undefined,
      discountType: input.discountType,
      discountValue: input.discountValue,
      minOrderPaise,
      maxDiscountPaise,
      startDate: input.startDate,
      endDate: input.endDate,
      usageLimit: input.usageLimit,
      isActive: input.isActive,
    },
  });

  return formatPrismaCoupon(coupon);
}

export async function deleteDbCoupon(id: string) {
  return await prisma.coupon.delete({
    where: { id },
  });
}

export async function toggleDbCouponActive(id: string, isActive: boolean) {
  return await prisma.coupon.update({
    where: { id },
    data: { isActive },
  });
}
