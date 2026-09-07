export interface StorefrontPage {
  id: string;
  title: string;
  slug: string;
  path: string;
  type: "CORE" | "COMMERCE" | "POLICY";
  status: "PUBLISHED" | "DRAFT";
  lastModified: string;
  sectionsCount: number;
}

export interface HomePageContent {
  announcementText: string;
  announcementBadge: string;
  announcementLinkText: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  heroFeaturedTag: string;
  ourProductsTitle: string;
  ourProductsSubtitle: string;
  shopByIndustryTitle: string;
  shopByIndustrySubtitle: string;
  packingMaterialTitle: string;
  packingMaterialSubtitle: string;
  builder3DTitle: string;
  builder3DSubtitle: string;
  builder3DCtaText: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterButtonText: string;
}

export const DEFAULT_HOME_CONTENT: HomePageContent = {
  announcementText: "Free Shipping on Custom Box Orders Above ₹2,500 Across India",
  announcementBadge: "LIMITED OFFER",
  announcementLinkText: "Use Code BOXCARE10",
  heroBadge: "🏭 DIRECT FROM FACTORY",
  heroTitle: "Premium Packaging Crafted for Growing Brands",
  heroSubtitle: "Manufactured with high-strength E-flute & 3-ply corrugated board. Low MOQs, fast 48-hour factory dispatch, and pan-India shipping.",
  heroPrimaryCtaText: "Shop Mailer Boxes",
  heroSecondaryCtaText: "Custom Box Calculator",
  heroFeaturedTag: "★ Trusted by 2,400+ Ecommerce & D2C Brands",
  ourProductsTitle: "Our Packaging Products",
  ourProductsSubtitle: "High-grade corrugated shipping boxes, mailers, and accessories designed for maximum protection.",
  shopByIndustryTitle: "Shop by Industry",
  shopByIndustrySubtitle: "Tailored packaging dimensions for food, cosmetics, apparel, electronics, and pharma.",
  packingMaterialTitle: "All Type Packing Material",
  packingMaterialSubtitle: "Single-source supply for protective rolls, tapes, and courier flyers.",
  builder3DTitle: "Custom Box 3D Configurator",
  builder3DSubtitle: "Enter custom dimensions, choose board ply, preview in 3D, and calculate instant volume tier pricing.",
  builder3DCtaText: "Launch 3D Box Builder",
  newsletterTitle: "Stay Ahead in Modern Packaging",
  newsletterSubtitle: "Subscribe for factory wholesale discounts, new size releases, and packaging guides.",
  newsletterButtonText: "Subscribe",
};

export const STOREFRONT_PAGES_LIST: StorefrontPage[] = [
  {
    id: "page-home",
    title: "Home Page",
    slug: "",
    path: "/",
    type: "CORE",
    status: "PUBLISHED",
    lastModified: "Today, 4:10 PM",
    sectionsCount: 6,
  },
  {
    id: "page-products",
    title: "All Products & Categories",
    slug: "products",
    path: "/products",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "Today",
    sectionsCount: 5,
  },
  {
    id: "page-cat-mailer-boxes",
    title: "Mailer Boxes Collection",
    slug: "category/mailer-boxes",
    path: "/category/mailer-boxes",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "Today",
    sectionsCount: 4,
  },
  {
    id: "page-cat-corrugated-boxes",
    title: "Corrugated Cartons & Boxes",
    slug: "category/corrugated-boxes",
    path: "/category/corrugated-boxes",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "Today",
    sectionsCount: 4,
  },
  {
    id: "page-accessories",
    title: "Tapes & Packaging Accessories",
    slug: "accessories",
    path: "/accessories",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "Today",
    sectionsCount: 5,
  },
  {
    id: "page-cart",
    title: "Shopping Cart",
    slug: "cart",
    path: "/cart",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "Today",
    sectionsCount: 3,
  },
  {
    id: "page-custom-boxes",
    title: "Custom Box 3D Calculator",
    slug: "custom-boxes",
    path: "/custom-boxes",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "2 days ago",
    sectionsCount: 3,
  },
  {
    id: "page-bulk-orders",
    title: "Bulk & Wholesale Orders",
    slug: "bulk-orders",
    path: "/bulk-orders",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "5 days ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-shipping-boxes",
    title: "Shipping Boxes",
    slug: "category/shipping-boxes",
    path: "/category/shipping-boxes",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "3 days ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-pizza-boxes",
    title: "Pizza Boxes",
    slug: "category/pizza-boxes",
    path: "/category/pizza-boxes",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "4 days ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-mono-cartons",
    title: "Mono Cartons",
    slug: "category/mono-cartons",
    path: "/category/mono-cartons",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "5 days ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-courier-bags",
    title: "Courier Bags",
    slug: "category/courier-bags",
    path: "/category/courier-bags",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-paper-bags",
    title: "Paper Bags",
    slug: "category/paper-bags",
    path: "/category/paper-bags",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-tape-rolls",
    title: "Tape Rolls",
    slug: "category/tape-rolls",
    path: "/category/tape-rolls",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-bubble-wrap",
    title: "Bubble Wrap & Cushioning",
    slug: "category/bubble-wrap",
    path: "/category/bubble-wrap",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-corrugated-rolls",
    title: "Corrugated Rolls",
    slug: "category/corrugated-rolls",
    path: "/category/corrugated-rolls",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-cat-corrugated-sheets",
    title: "Corrugated Sheets",
    slug: "category/corrugated-sheets",
    path: "/category/corrugated-sheets",
    type: "COMMERCE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 4,
  },
  {
    id: "page-about",
    title: "About Us",
    slug: "about",
    path: "/about",
    type: "CORE",
    status: "PUBLISHED",
    lastModified: "Yesterday",
    sectionsCount: 4,
  },
  {
    id: "page-contact",
    title: "Contact & FAQs",
    slug: "contact",
    path: "/contact",
    type: "CORE",
    status: "PUBLISHED",
    lastModified: "3 days ago",
    sectionsCount: 3,
  },
  {
    id: "page-industries",
    title: "Industries We Serve",
    slug: "industries",
    path: "/industries",
    type: "CORE",
    status: "PUBLISHED",
    lastModified: "1 week ago",
    sectionsCount: 5,
  },
  {
    id: "page-privacy",
    title: "Privacy Policy",
    slug: "policies/privacy",
    path: "/policies",
    type: "POLICY",
    status: "PUBLISHED",
    lastModified: "Last month",
    sectionsCount: 1,
  },
  {
    id: "page-terms",
    title: "Terms & Conditions",
    slug: "policies/terms",
    path: "/policies",
    type: "POLICY",
    status: "PUBLISHED",
    lastModified: "Last month",
    sectionsCount: 1,
  },
  {
    id: "page-shipping",
    title: "Shipping & Return Policy",
    slug: "policies/shipping",
    path: "/policies",
    type: "POLICY",
    status: "PUBLISHED",
    lastModified: "Last month",
    sectionsCount: 1,
  },
];
