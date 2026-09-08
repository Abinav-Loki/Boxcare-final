export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  featured: boolean;
  offerBadge?: string;
  offerText?: string;
}

export const INITIAL_STOREFRONT_CATEGORIES: AdminCategory[] = [
  {
    id: "cat-1",
    name: "Mailer Boxes",
    slug: "mailer-boxes",
    image: "/images/mailer-boxes.png",
    description: "Self-locking flap mailers manufactured from durable E-flute kraft board with premium crush resistance.",
    productCount: 14,
    sortOrder: 1,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: true,
  },
  {
    id: "cat-2",
    name: "Corrugated Boxes",
    slug: "corrugated-boxes",
    image: "/images/corrugated-boxes.png",
    description: "Heavy-duty 3-ply and 5-ply universal outer packaging cartons for industrial and bulk shipping.",
    productCount: 8,
    sortOrder: 2,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: true,
  },
  {
    id: "cat-3",
    name: "Shipping Boxes",
    slug: "shipping-boxes",
    image: "/images/shipping-boxes.png",
    description: "Standard regular slotted containers (RSC) optimized for ecommerce parcel transport and fulfillment.",
    productCount: 6,
    sortOrder: 3,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: true,
  },
  {
    id: "cat-4",
    name: "Custom Printed Boxes",
    slug: "custom-printed-boxes",
    image: "/images/custom-printed-boxes.png",
    description: "Brand-customized corrugated boxes with full CMYK logo, custom sizing, and artwork printing.",
    productCount: 4,
    sortOrder: 4,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: true,
  },
  {
    id: "cat-5",
    name: "Pizza & Food Boxes",
    slug: "pizza-boxes",
    image: "/images/pizza-boxes.png",
    description: "Food-grade grease-resistant ventilated takeaway delivery boxes for pizzerias and bakeries.",
    productCount: 5,
    sortOrder: 5,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: false,
  },
  {
    id: "cat-6",
    name: "Mono Cartons",
    slug: "mono-cartons",
    image: "/images/mono-cartons.png",
    description: "Premium folding duplex board packaging for cosmetics, pharmaceuticals, retail, and FMCG products.",
    productCount: 3,
    sortOrder: 6,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: false,
  },
  {
    id: "cat-7",
    name: "Packaging Tape Rolls",
    slug: "tape-rolls",
    image: "/images/tape-rolls.png",
    description: "High-adhesion BOPP brown & transparent packing tapes and reinforced water-activated kraft paper tape.",
    productCount: 4,
    sortOrder: 7,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: true,
  },
  {
    id: "cat-8",
    name: "Bubble Wrap & Protective Rolls",
    slug: "bubble-wrap",
    image: "/images/bubble-wrap.png",
    description: "Shock-absorbing air bubble rolls and foam sheets for fragile surface protection and void fill.",
    productCount: 2,
    sortOrder: 8,
    status: "ACTIVE",
    stockStatus: "OUT_OF_STOCK",
    featured: false,
  },
  {
    id: "cat-9",
    name: "Corrugated Rolls & Sheets",
    slug: "corrugated-rolls",
    image: "/images/corrugated-rolls.png",
    description: "Single face 2-ply corrugated rolls and divider separator sheets for surface wrapping and cushioning.",
    productCount: 3,
    sortOrder: 9,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: false,
  },
  {
    id: "cat-10",
    name: "Courier & Paper Bags",
    slug: "courier-bags",
    image: "/images/courier-bags.png",
    description: "Tamper-evident POD courier flyer bags with adhesive flap seal and eco-friendly brown kraft bags.",
    productCount: 4,
    sortOrder: 10,
    status: "ACTIVE",
    stockStatus: "IN_STOCK",
    featured: false,
  },
];
