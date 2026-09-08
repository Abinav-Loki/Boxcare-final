import { PRODUCTS } from "@/lib/products-data";
import { INITIAL_STOREFRONT_CATEGORIES } from "@/components/admin/categories/category-types";

export type NavigationMenuLocation =
  | "HEADER"
  | "CATEGORY_MENU"
  | "MOBILE_DRAWER"
  | "FOOTER_PRODUCTS"
  | "FOOTER_INDUSTRIES"
  | "FOOTER_SUPPORT";

export type NavigationItemType = "PAGE" | "CATEGORY" | "PRODUCT" | "POLICY" | "CUSTOM_URL";

export interface AdminNavigationItem {
  id: string;
  title: string;
  url: string;
  type: NavigationItemType;
  location: NavigationMenuLocation;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  targetBlank?: boolean;
  badge?: string;
  description?: string;
  resourceId?: string;
  resourceName?: string;
  children?: AdminNavigationItem[];
}

export interface MockResourceItem {
  id: string;
  title: string;
  url: string;
  type: NavigationItemType;
  subtitle?: string;
  badge?: string;
  image?: string;
}

// 1. Exact Storefront Pages (extracted from components/store/navbar.tsx & app routes)
export const MOCK_PAGES_LIBRARY: MockResourceItem[] = [
  { id: "p-home", title: "Home", url: "/", type: "PAGE", subtitle: "Main storefront landing" },
  { id: "p-products", title: "Shop Products (All Categories)", url: "/products", type: "PAGE", subtitle: "Full packaging catalog" },
  { id: "p-custom-boxes", title: "Custom Boxes Builder", url: "/custom-boxes", type: "PAGE", subtitle: "Interactive 3D packaging builder", badge: "POPULAR" },
  { id: "p-bulk-orders", title: "Wholesale & Bulk Orders", url: "/bulk-orders", type: "PAGE", subtitle: "B2B volume discount quotes" },
  { id: "p-accessories", title: "Tapes & Packaging Accessories", url: "/accessories", type: "PAGE", subtitle: "Tapes, rolls & packaging supplies" },
  { id: "p-industries", title: "Industries We Serve", url: "/industries", type: "PAGE", subtitle: "Food, Beauty, E-Commerce, Pharma" },
  { id: "p-about", title: "About Box Care", url: "/about", type: "PAGE", subtitle: "Our factory & packaging standards" },
  { id: "p-contact", title: "Contact & FAQs", url: "/contact", type: "PAGE", subtitle: "Customer support & inquiries" },
  { id: "p-cart", title: "Shopping Cart", url: "/cart", type: "PAGE", subtitle: "Cart & checkout" },
  { id: "p-track", title: "Track Order", url: "/order/track", type: "PAGE", subtitle: "Order tracking lookup" },
  { id: "p-signin", title: "Sign In / Account", url: "/signin", type: "PAGE", subtitle: "Customer account portal" },
];

// 2. Exact Storefront Policies (extracted from components/store/footer.tsx)
export const MOCK_POLICIES_LIBRARY: MockResourceItem[] = [
  { id: "pol-return", title: "Return Policy", url: "/policies/return-policy", type: "POLICY", subtitle: "Return & replacement guidelines" },
  { id: "pol-privacy", title: "Privacy Policy", url: "/policies/privacy-policy", type: "POLICY", subtitle: "Data protection & privacy terms" },
  { id: "pol-terms", title: "Terms of Service", url: "/policies/terms-of-service", type: "POLICY", subtitle: "Commercial usage agreement" },
  { id: "pol-shipping", title: "Shipping Policy", url: "/policies/shipping", type: "POLICY", subtitle: "Dispatch timelines & delivery" },
  { id: "pol-cancellation", title: "Cancellation Policy", url: "/policies/cancellation", type: "POLICY", subtitle: "Order cancellation rules" },
];

// 3. Exact Storefront Categories (from components/store/footer.tsx & category-types.ts)
export const MOCK_CATEGORIES_LIBRARY: MockResourceItem[] = [
  { id: "cat-mailer", title: "Mailer Boxes", url: "/category/mailer-boxes", type: "CATEGORY", subtitle: "Self-locking Kraft mailers", image: "/images/mailer-boxes.png" },
  { id: "cat-corrugated", title: "Corrugated Boxes", url: "/category/corrugated-boxes", type: "CATEGORY", subtitle: "Heavy-duty 3-ply & 5-ply cartons", image: "/images/corrugated-boxes.png" },
  { id: "cat-shipping", title: "Shipping Boxes", url: "/category/shipping-boxes", type: "CATEGORY", subtitle: "RSC ecommerce shipping boxes", image: "/images/shipping-boxes.png" },
  { id: "cat-pizza", title: "Pizza Boxes", url: "/category/pizza-boxes", type: "CATEGORY", subtitle: "Food-grade ventilation cartons", image: "/images/pizza-boxes.png" },
  { id: "cat-mono", title: "Mono Cartons", url: "/category/mono-cartons", type: "CATEGORY", subtitle: "Retail product cartons", image: "/images/mono-cartons.png" },
  { id: "cat-courier", title: "Courier Bags", url: "/category/courier-bags", type: "CATEGORY", subtitle: "Tamper-evident flyer bags", image: "/images/courier-bags.png" },
  { id: "cat-paperbags", title: "Paper Bags", url: "/category/paper-bags", type: "CATEGORY", subtitle: "Kraft retail shopping bags", image: "/images/mailer-boxes.png" },
  { id: "cat-taperolls", title: "Tape Rolls", url: "/category/tape-rolls", type: "CATEGORY", subtitle: "BOPP self-adhesive packaging tape", image: "/images/tape-rolls.png" },
  { id: "cat-bubblewrap", title: "Bubble Wrap", url: "/category/bubble-wrap", type: "CATEGORY", subtitle: "Protective cushioning wrap", image: "/images/bubble-wrap.png" },
  { id: "cat-corrugatedrolls", title: "Corrugated Rolls", url: "/category/corrugated-rolls", type: "CATEGORY", subtitle: "Flexible 2-ply protection rolls", image: "/images/corrugated-rolls.png" },
  { id: "cat-corrugatedsheets", title: "Corrugated Sheets", url: "/category/corrugated-sheets", type: "CATEGORY", subtitle: "Layer separator sheets", image: "/images/corrugated-boxes.png" },
  { id: "cat-custom-printed", title: "Custom Printed Boxes", url: "/category/custom-printed-boxes", type: "CATEGORY", subtitle: "Full CMYK branded packaging", image: "/images/custom-printed-boxes.png" },
];

// 4. Products Library from live products-data
export const MOCK_PRODUCTS_LIBRARY: MockResourceItem[] = PRODUCTS.slice(0, 24).map((prod) => ({
  id: `prod-${prod.id}`,
  title: prod.name,
  url: `/product/${prod.slug}`,
  type: "PRODUCT",
  subtitle: `${prod.category} • ${prod.size_inches_short}`,
  image: prod.image,
  badge: prod.isPopular ? "POPULAR" : undefined,
}));

// 5. Exact Storefront Initial Seed Navigation (mirrors components/store/navbar.tsx and components/store/footer.tsx)
export const INITIAL_NAVIGATION_DATA: AdminNavigationItem[] = [
  // ================= 1. STOREFRONT HEADER NAVBAR =================
  {
    id: "nav-h-1",
    title: "Home",
    url: "/",
    type: "PAGE",
    location: "HEADER",
    sortOrder: 1,
    isActive: true,
    parentId: null,
  },
  {
    id: "nav-h-2",
    title: "Shop Products",
    url: "/products",
    type: "PAGE",
    location: "HEADER",
    sortOrder: 2,
    isActive: true,
    parentId: null,
  },
  // Child items under Shop Products (from navbar.tsx lines 193-245)
  {
    id: "nav-h-2-1",
    title: "All Product Categories",
    url: "/products",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 1,
    isActive: true,
    description: "Browse full packaging collection",
  },
  {
    id: "nav-h-2-2",
    title: "Mailer Boxes Collection",
    url: "/category/mailer-boxes",
    type: "CATEGORY",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 2,
    isActive: true,
    description: "Self-locking Kraft mailer boxes",
  },
  {
    id: "nav-h-2-3",
    title: "Corrugated Cartons",
    url: "/category/corrugated-boxes",
    type: "CATEGORY",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 3,
    isActive: true,
    description: "3-ply & 5-ply outer shipping cartons",
  },
  {
    id: "nav-h-2-4",
    title: "Tapes & Packaging Accessories",
    url: "/accessories",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 4,
    isActive: true,
    description: "Tapes, films, bubble wrap and bags",
  },
  {
    id: "nav-h-2-5",
    title: "Wholesale & Bulk Orders",
    url: "/bulk-orders",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 5,
    isActive: true,
    description: "Volume tier discounts and inquiries",
  },
  {
    id: "nav-h-2-6",
    title: "Shopping Cart",
    url: "/cart",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-2",
    sortOrder: 6,
    isActive: true,
    description: "View customer bag and proceed to checkout",
  },
  {
    id: "nav-h-3",
    title: "Company & Support",
    url: "/about",
    type: "PAGE",
    location: "HEADER",
    sortOrder: 3,
    isActive: true,
    parentId: null,
  },
  // Child items under Company & Support (from navbar.tsx lines 261-283)
  {
    id: "nav-h-3-1",
    title: "Industries We Serve",
    url: "/industries",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-3",
    sortOrder: 1,
    isActive: true,
    description: "Food, Beauty, E-Commerce, Pharma solutions",
  },
  {
    id: "nav-h-3-2",
    title: "About Box Care",
    url: "/about",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-3",
    sortOrder: 2,
    isActive: true,
    description: "Our factory, heritage & packaging standards",
  },
  {
    id: "nav-h-3-3",
    title: "Contact & FAQs",
    url: "/contact",
    type: "PAGE",
    location: "HEADER",
    parentId: "nav-h-3",
    sortOrder: 3,
    isActive: true,
    description: "Support hotline, email & FAQ center",
  },
  {
    id: "nav-h-4",
    title: "Custom Boxes",
    url: "/custom-boxes",
    type: "PAGE",
    location: "HEADER",
    sortOrder: 4,
    isActive: true,
    parentId: null,
    badge: "CUSTOM",
  },

  // ================= 2. QUICK CATEGORY RIBBON =================
  { id: "nav-c-1", title: "Mailer Boxes", url: "/category/mailer-boxes", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 1, isActive: true, parentId: null },
  { id: "nav-c-2", title: "Corrugated Boxes", url: "/category/corrugated-boxes", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 2, isActive: true, parentId: null },
  { id: "nav-c-3", title: "Shipping Boxes", url: "/category/shipping-boxes", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 3, isActive: true, parentId: null },
  { id: "nav-c-4", title: "Pizza Boxes", url: "/category/pizza-boxes", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 4, isActive: true, parentId: null },
  { id: "nav-c-5", title: "Mono Cartons", url: "/category/mono-cartons", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 5, isActive: true, parentId: null },
  { id: "nav-c-6", title: "Tape Rolls", url: "/category/tape-rolls", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 6, isActive: true, parentId: null },
  { id: "nav-c-7", title: "Bubble Wrap", url: "/category/bubble-wrap", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 7, isActive: true, parentId: null },
  { id: "nav-c-8", title: "Custom Printed Boxes", url: "/category/custom-printed-boxes", type: "CATEGORY", location: "CATEGORY_MENU", sortOrder: 8, isActive: true, parentId: null, badge: "CUSTOM" },

  // ================= 3. MOBILE MENU DRAWER =================
  { id: "nav-m-1", title: "Home", url: "/", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 1, isActive: true, parentId: null },
  { id: "nav-m-2", title: "Shop Products", url: "/products", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 2, isActive: true, parentId: null },
  { id: "nav-m-3", title: "Company & Support", url: "/about", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 3, isActive: true, parentId: null },
  { id: "nav-m-4", title: "Custom Boxes Builder", url: "/custom-boxes", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 4, isActive: true, parentId: null, badge: "BUILDER" },
  { id: "nav-m-5", title: "Track Your Order", url: "/order/track", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 5, isActive: true, parentId: null },
  { id: "nav-m-6", title: "Customer Sign In", url: "/signin", type: "PAGE", location: "MOBILE_DRAWER", sortOrder: 6, isActive: true, parentId: null },

  // ================= 4. FOOTER: PRODUCTS COLUMN =================
  { id: "nav-fp-1", title: "Mailer Boxes", url: "/category/mailer-boxes", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 1, isActive: true, parentId: null },
  { id: "nav-fp-2", title: "Corrugated Boxes", url: "/category/corrugated-boxes", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 2, isActive: true, parentId: null },
  { id: "nav-fp-3", title: "Shipping Boxes", url: "/category/shipping-boxes", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 3, isActive: true, parentId: null },
  { id: "nav-fp-4", title: "Pizza Boxes", url: "/category/pizza-boxes", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 4, isActive: true, parentId: null },
  { id: "nav-fp-5", title: "Mono Cartons", url: "/category/mono-cartons", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 5, isActive: true, parentId: null },
  { id: "nav-fp-6", title: "Courier Bags", url: "/category/courier-bags", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 6, isActive: true, parentId: null },
  { id: "nav-fp-7", title: "Tape Rolls", url: "/category/tape-rolls", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 7, isActive: true, parentId: null },
  { id: "nav-fp-8", title: "Custom Printed Boxes", url: "/category/custom-printed-boxes", type: "CATEGORY", location: "FOOTER_PRODUCTS", sortOrder: 8, isActive: true, parentId: null },

  // ================= 5. FOOTER: INDUSTRIES COLUMN =================
  { id: "nav-fi-1", title: "Food & Beverage", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 1, isActive: true, parentId: null },
  { id: "nav-fi-2", title: "Beauty & Cosmetics", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 2, isActive: true, parentId: null },
  { id: "nav-fi-3", title: "Pharma", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 3, isActive: true, parentId: null },
  { id: "nav-fi-4", title: "E-Commerce", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 4, isActive: true, parentId: null },
  { id: "nav-fi-5", title: "Fashion", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 5, isActive: true, parentId: null },
  { id: "nav-fi-6", title: "Electronics", url: "/industries", type: "PAGE", location: "FOOTER_INDUSTRIES", sortOrder: 6, isActive: true, parentId: null },

  // ================= 6. FOOTER: SUPPORT & POLICIES =================
  { id: "nav-fs-1", title: "FAQs", url: "/about", type: "PAGE", location: "FOOTER_SUPPORT", sortOrder: 1, isActive: true, parentId: null },
  { id: "nav-fs-2", title: "Track Order", url: "/order/track", type: "PAGE", location: "FOOTER_SUPPORT", sortOrder: 2, isActive: true, parentId: null },
  { id: "nav-fs-3", title: "Request Sample", url: "/contact", type: "PAGE", location: "FOOTER_SUPPORT", sortOrder: 3, isActive: true, parentId: null },
  { id: "nav-fs-4", title: "Return Policy", url: "/policies/return-policy", type: "POLICY", location: "FOOTER_SUPPORT", sortOrder: 4, isActive: true, parentId: null },
  { id: "nav-fs-5", title: "Privacy Policy", url: "/policies/privacy-policy", type: "POLICY", location: "FOOTER_SUPPORT", sortOrder: 5, isActive: true, parentId: null },
  { id: "nav-fs-6", title: "Terms of Service", url: "/policies/terms-of-service", type: "POLICY", location: "FOOTER_SUPPORT", sortOrder: 6, isActive: true, parentId: null },
];
