import { prisma } from "./prisma";
import { OrderStatus, PaymentStatus, ShipmentStatus } from "@/generated/prisma/client";

export interface FormattedOrderItem {
  id: string;
  orderId: string;
  variantId: string | null;
  productName: string;
  sku: string | null;
  material: string | null;
  packQuantity: number | null;
  unitPricePaise: number;
  unitPriceRupees: number;
  quantity: number;
  totalPricePaise: number;
  totalPriceRupees: number;
  image?: string;
}

export interface FormattedOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string | null;
  gstNumber: string | null;
  shippingAddress: string;
  subtotalRupees: number;
  discountRupees: number;
  shippingFeeRupees: number;
  taxRupees: number;
  totalRupees: number;
  subtotalPaise: number;
  discountPaise: number;
  shippingFeePaise: number;
  taxPaise: number;
  totalPaise: number;
  couponCode: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shipmentStatus: ShipmentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: FormattedOrderItem[];
  payments: any[];
  shipments: any[];
}

export function formatPrismaOrder(o: any): FormattedOrder {
  const fullAddress = [
    o.addressLine1,
    o.addressLine2,
    o.city,
    o.state,
    o.pincode,
  ].filter(Boolean).join(", ");

  return {
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    companyName: o.companyName,
    gstNumber: o.gstNumber,
    shippingAddress: fullAddress,
    subtotalRupees: Math.round(o.subtotalPaise / 100),
    discountRupees: Math.round(o.discountPaise / 100),
    shippingFeeRupees: Math.round(o.shippingFeePaise / 100),
    taxRupees: Math.round(o.taxPaise / 100),
    totalRupees: Math.round(o.totalPaise / 100),
    subtotalPaise: o.subtotalPaise,
    discountPaise: o.discountPaise,
    shippingFeePaise: o.shippingFeePaise,
    taxPaise: o.taxPaise,
    totalPaise: o.totalPaise,
    couponCode: o.couponCode,
    status: o.status,
    paymentStatus: o.paymentStatus,
    shipmentStatus: o.shipmentStatus,
    notes: o.notes,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    items: (o.items || []).map((item: any) => ({
      id: item.id,
      orderId: item.orderId,
      variantId: item.variantId,
      productName: item.productName,
      sku: item.sku,
      material: item.material,
      packQuantity: item.packQuantity,
      unitPricePaise: item.unitPricePaise,
      unitPriceRupees: Math.round(item.unitPricePaise / 100),
      quantity: item.quantity,
      totalPricePaise: item.totalPricePaise,
      totalPriceRupees: Math.round(item.totalPricePaise / 100),
      image: item.variant?.product?.images?.[0]?.url || "/images/box_4_4_1_5.png",
    })),
    payments: o.payment || [],
    shipments: o.shipment || [],
  };
}

export async function getDbOrders(options?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  take?: number;
}) {
  const where: any = {};

  if (options?.status) {
    where.status = options.status;
  }
  if (options?.paymentStatus) {
    where.paymentStatus = options.paymentStatus;
  }
  if (options?.search?.trim()) {
    const q = options.search.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customerName: { contains: q, mode: "insensitive" } },
      { customerEmail: { contains: q, mode: "insensitive" } },
      { customerPhone: { contains: q, mode: "insensitive" } },
      { couponCode: { contains: q, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
      payment: true,
      shipment: true,
      customer: true,
    },
    orderBy: { createdAt: "desc" },
    take: options?.take,
  });

  return orders.map(formatPrismaOrder);
}

export async function getDbOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
      payment: true,
      shipment: true,
      customer: true,
      shippingAddress: true,
    },
  });

  if (!order) return null;
  return formatPrismaOrder(order);
}

export async function getDbOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
      payment: true,
      shipment: true,
      customer: true,
      shippingAddress: true,
    },
  });

  if (!order) return null;
  return formatPrismaOrder(order);
}

export async function updateDbOrderStatus(id: string, status: OrderStatus, notes?: string) {
  const data: any = { status };
  if (notes !== undefined) {
    data.notes = notes;
  }

  const updated = await prisma.order.update({
    where: { id },
    data,
    include: {
      items: true,
      payment: true,
      shipment: true,
    },
  });

  return formatPrismaOrder(updated);
}

export async function overrideDbOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
  overrideReason: string
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error(`Order with id ${id} not found`);

  const auditNote = `[Admin Payment Override]: Status changed to ${paymentStatus}. Reason: ${overrideReason} (at ${new Date().toISOString()})`;
  const existingNotes = order.notes ? `${order.notes}\n${auditNote}` : auditNote;

  const updated = await prisma.order.update({
    where: { id },
    data: {
      paymentStatus,
      notes: existingNotes,
    },
    include: {
      items: true,
      payment: true,
      shipment: true,
    },
  });

  return formatPrismaOrder(updated);
}
