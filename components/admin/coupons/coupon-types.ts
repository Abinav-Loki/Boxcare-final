export type CouponDiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";

export type CouponStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | "USED_UP";

export interface AdminCoupon {
  id: string;
  code: string;
  title: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number; // Percentage (e.g. 10) or Flat Amount (e.g. 250)
  minOrderValue: number;
  maxDiscountCap?: number; // For percentage discounts
  usageCount: number;
  usageLimit: number | null; // null means Unlimited
  validFrom: string; // YYYY-MM-DD
  validUntil: string; // YYYY-MM-DD
  status: CouponStatus;
  createdAt: string;
  appliesToCategory?: string; // "ALL" or specific category slug
  isFeatured?: boolean;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  discountText: string;
  couponCode: string;
  validUntil: string;
  status: "ACTIVE" | "UPCOMING" | "EXPIRED";
  bgColor?: string;
  textColor?: string;
}

export const INITIAL_COUPONS_DATA: AdminCoupon[] = [
  {
    id: "coup-1",
    code: "BOXCARE10",
    title: "10% Off First Bulk Order",
    description: "Welcome discount for new B2B and store customer registrations.",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderValue: 1500,
    maxDiscountCap: 1000,
    usageCount: 342,
    usageLimit: 1000,
    validFrom: "2026-01-01",
    validUntil: "2026-12-31",
    status: "ACTIVE",
    createdAt: "2026-01-01",
    isFeatured: true,
  },
  {
    id: "coup-2",
    code: "FREESHIP",
    title: "Free Shipping on Orders",
    description: "Waives 100% shipping charges on orders with standard delivery.",
    discountType: "FREE_SHIPPING",
    discountValue: 150,
    minOrderValue: 2000,
    usageCount: 512,
    usageLimit: null, // Unlimited
    validFrom: "2026-02-01",
    validUntil: "2026-12-31",
    status: "ACTIVE",
    createdAt: "2026-02-01",
    isFeatured: true,
  },
  {
    id: "coup-3",
    code: "WELCOME500",
    title: "Flat ₹500 Off Premium Cartons",
    description: "Flat cash discount on multi-depth heavy shipping boxes and mailers.",
    discountType: "FIXED_AMOUNT",
    discountValue: 500,
    minOrderValue: 4500,
    usageCount: 188,
    usageLimit: 500,
    validFrom: "2026-03-01",
    validUntil: "2026-11-30",
    status: "ACTIVE",
    createdAt: "2026-03-01",
    isFeatured: false,
  },
  {
    id: "coup-4",
    code: "ECOPACK15",
    title: "15% Off 100% Recycled Kraft",
    description: "Promotional rebate on biodegradable kraft mailers and paper tapes.",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderValue: 3000,
    maxDiscountCap: 1500,
    usageCount: 120,
    usageLimit: 300,
    validFrom: "2026-04-01",
    validUntil: "2026-10-31",
    status: "ACTIVE",
    createdAt: "2026-04-01",
    isFeatured: false,
  },
  {
    id: "coup-5",
    code: "BULK2000",
    title: "Factory Tier ₹2,000 Voucher",
    description: "Enterprise discount for order batches above 2,500 boxes.",
    discountType: "FIXED_AMOUNT",
    discountValue: 2000,
    minOrderValue: 18000,
    usageCount: 45,
    usageLimit: 100,
    validFrom: "2026-05-01",
    validUntil: "2026-12-31",
    status: "ACTIVE",
    createdAt: "2026-05-01",
    isFeatured: false,
  },
  {
    id: "coup-6",
    code: "FESTIVE25",
    title: "Festive Clearance 25% Off",
    description: "Special seasonal festival discount for retail businesses.",
    discountType: "PERCENTAGE",
    discountValue: 25,
    minOrderValue: 2500,
    maxDiscountCap: 2000,
    usageCount: 200,
    usageLimit: 200,
    validFrom: "2026-01-10",
    validUntil: "2026-02-15",
    status: "USED_UP",
    createdAt: "2026-01-05",
    isFeatured: false,
  },
  {
    id: "coup-7",
    code: "SUMMERDEAL",
    title: "Summer Flash 12% Off",
    description: "Seasonal promotion for courier flyers and corrugated rolls.",
    discountType: "PERCENTAGE",
    discountValue: 12,
    minOrderValue: 1800,
    maxDiscountCap: 800,
    usageCount: 89,
    usageLimit: 150,
    validFrom: "2026-05-01",
    validUntil: "2026-06-30",
    status: "EXPIRED",
    createdAt: "2026-04-28",
    isFeatured: false,
  },
  {
    id: "coup-8",
    code: "VIPCLIENT",
    title: "VIP Account 20% Rebate",
    description: "Private discount code reserved for contracted suppliers.",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 5000,
    maxDiscountCap: 3000,
    usageCount: 14,
    usageLimit: 50,
    validFrom: "2026-06-01",
    validUntil: "2026-12-31",
    status: "INACTIVE",
    createdAt: "2026-05-25",
    isFeatured: false,
  },
];

export const INITIAL_OFFERS_DATA: PromotionalOffer[] = [
  {
    id: "off-1",
    title: "Starter Pack Special Bundle",
    badge: "🔥 HOT DEAL",
    description: "Get 10% off your first bulk custom corrugated order with instant factory design check.",
    discountText: "10% OFF",
    couponCode: "BOXCARE10",
    validUntil: "Valid till Dec 31, 2026",
    status: "ACTIVE",
    bgColor: "#FFF8F0",
    textColor: "#8B4513",
  },
  {
    id: "off-2",
    title: "Free Nationwide Shipping Promotion",
    badge: "🚚 FREE FREIGHT",
    description: "Zero delivery fees on all orders exceeding ₹2,000 threshold to all pincodes in India.",
    discountText: "100% FREE SHIP",
    couponCode: "FREESHIP",
    validUntil: "All Year Long",
    status: "ACTIVE",
    bgColor: "#F0FDF4",
    textColor: "#15803D",
  },
  {
    id: "off-3",
    title: "Eco-Friendly Packaging Drive",
    badge: "🌱 SUSTAINABLE",
    description: "Flat ₹500 off on 100% biodegradable corrugated cartons and paper tape accessories.",
    discountText: "FLAT ₹500 OFF",
    couponCode: "WELCOME500",
    validUntil: "Valid till Nov 30, 2026",
    status: "ACTIVE",
    bgColor: "#F0F9FF",
    textColor: "#0369A1",
  },
];
