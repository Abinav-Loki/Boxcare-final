import { prisma } from "./prisma";
import { formatPrismaOrder } from "./orders";

export async function getDbDashboardMetrics() {
  const [
    totalProducts,
    activeProducts,
    totalCategories,
    totalOrders,
    pendingOrdersCount,
    lowStockVariantsCount,
    recentOrders,
    activeBannersCount,
    confirmedRevenueRaw,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.category.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING_PAYMENT", "PROCESSING", "PACKED"] } } }),
    prisma.productVariant.count({ where: { stockQuantity: { lte: 50 } } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: { include: { images: true } },
              },
            },
          },
        },
        payment: true,
        shipment: true,
      },
    }),
    prisma.banner.count({ where: { isActive: true } }),
    prisma.order.aggregate({
      where: {
        paymentStatus: "SUCCESS",
      },
      _sum: {
        totalPaise: true,
      },
    }),
  ]);

  const totalRevenueRupees = Math.round((confirmedRevenueRaw._sum.totalPaise || 0) / 100);

  // Top low stock items
  const lowStockItems = await prisma.productVariant.findMany({
    where: { stockQuantity: { lte: 100 } },
    take: 5,
    include: {
      product: {
        include: { images: true, category: true },
      },
    },
    orderBy: { stockQuantity: "asc" },
  });

  return {
    totalProducts,
    activeProducts,
    totalCategories,
    totalOrders,
    pendingOrdersCount,
    lowStockVariantsCount,
    totalRevenueRupees,
    activeBannersCount,
    recentOrders: recentOrders.map(formatPrismaOrder),
    lowStockItems: lowStockItems.map((v) => ({
      id: v.id,
      name: v.product.name,
      category: v.product.category.name,
      sku: v.sku || `${v.product.slug}-${v.packQuantity}`,
      stock: v.stockQuantity,
      packQuantity: v.packQuantity,
      image: v.product.images[0]?.url || "/images/box_4_4_1_5.png",
      price: Math.round(v.sellingPricePaise / 100),
    })),
  };
}
