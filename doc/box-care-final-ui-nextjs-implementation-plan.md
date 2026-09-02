# Box Care Final UI-Based Next.js Architecture And Implementation Plan

> Audience: Internal ACUTIX development team  
> UI baseline: deployed finalized UI at `https://boxcare-c881.vercel.app/`  
> Purpose: Convert the finalized UI into a production-ready, maintainable Next.js e-commerce platform with dynamic storefront, admin-controlled catalog/navigation, CCAvenue payments, and manual shipment flow.

---

## 1. Executive Summary

Box Care currently has a finalized deployed storefront UI at `https://boxcare-c881.vercel.app/`. The production build must preserve the approved visual direction and customer flows, but rebuild the platform as a maintainable, database-driven Next.js application.

The final system must support:

- Dynamic product and category management from the admin panel.
- Dynamic navigation controlled from admin, not hardcoded in frontend files.
- SEO-ready dynamic routes for categories, products, policies, and order tracking.
- Production checkout with server-validated cart, pricing, stock, shipping, and CCAvenue payment.
- Manual shipment management in v1, with a future path for courier API integration.
- Clean code structure that keeps UI, business logic, database access, validation, and provider integrations separate.

This is not a brochure site. The first screen and core routes must behave like a real packaging e-commerce store.

---

## 2. Current Finalized UI Baseline

The approved UI source is the deployed finalized Box Care UI:

```text
https://boxcare-c881.vercel.app/
```

When working from the committed GitHub repository, developers may clone the project into any local folder.

Current finalized UI characteristics:

- Deployed UI and interactions are the visual baseline.
- Page structure, colors, spacing, typography, product cards, navigation, cart behavior, and quote flows must be preserved unless the project lead approves a change.
- Existing product/category content shown in the deployed UI should be used as seed/reference data.
- Cart currently uses browser `localStorage`.
- Checkout button currently behaves as a prototype action.
- WhatsApp enquiry links are already part of the buying/quote flow.

Current UI pages to preserve and migrate:

| Static UI File        | Production Route                        | Notes                                                                                             |
| --------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `index.html`          | `/`                                     | Home page with hero, categories, product sections, search, quote prompts, trust/content sections. |
| `products.html`       | `/products`                             | All-products/catalogue page with filtering, sorting, and dynamic product cards.                   |
| `catalog.html`        | `/category/[slug]`                      | Category listing route driven by category slug and filters.                                       |
| `product-detail.html` | `/product/[slug]`                       | Dynamic product detail page using database product/variant data.                                  |
| `custom-boxes.html`   | `/custom-boxes`                         | Custom box calculator and multi-step quote builder.                                               |
| `mailer-boxes.html`   | `/category/mailer-boxes`                | Should become a normal dynamic category page.                                                     |
| `accessories.html`    | `/accessories` or category-driven route | Can remain landing page for accessories if needed.                                                |
| `bulk-orders.html`    | `/bulk-orders`                          | Bulk enquiry and wholesale buying route.                                                          |
| `industries.html`     | `/industries`                           | Industry use-case content route.                                                                  |
| `about.html`          | `/about`                                | Static/content-managed page.                                                                      |
| `contact.html`        | `/contact`                              | Contact, FAQ, support form, WhatsApp details.                                                     |

Additional production routes required:

- `/checkout`
- `/order/[orderNumber]`
- `/payment/success`
- `/payment/failure`
- `/payment/cancelled`
- `/policies/[slug]`
- `/search`
- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/categories`
- `/admin/navigation`
- `/admin/orders`
- `/admin/shipments`
- `/admin/coupons`
- `/admin/banners`
- `/admin/pages`
- `/admin/settings`

---

## 3. Current Development Setup And How To Use It

The active Next.js development project is already initialized in the committed repository root.

Developers must continue from this scaffold after cloning the repository. Do not create another Next.js app unless the project lead explicitly approves it.

Already completed in the project:

- Next.js App Router project created with TypeScript, Tailwind, ESLint, and npm.
- Box Care global theme tokens added in `app/globals.css`.
- Storefront route skeletons added for home, products, search, categories, product detail, custom boxes, bulk orders, accessories, industries, about, contact, checkout, order tracking, and policies.
- Admin route skeletons added for login, dashboard, products, categories, navigation, orders, shipments, coupons, banners, content pages, and settings.
- API placeholder routes added for CCAvenue initiate/response/cancel and uploads.
- Shared structure created under `components`, `lib`, `prisma`, and `generated`.
- `.env.example` added as the committed environment template.
- `.env.local` is ignored and must contain real secrets locally only.
- Prisma 7 configuration added with `prisma.config.ts`.
- Prisma client generation configured to output to `generated/prisma`.
- Starter database helper added in `lib/db/prisma.ts`.
- Starter Zod validation schemas added under `lib/validation`.
- Shared constants added in `lib/constants.ts`.
- Package scripts added for development, build, Prisma generation, migrations, Studio, and seed.

Local setup steps:

```bash
npm install
copy .env.example .env.local
npm run dev
```

After copying `.env.example`, developers must fill real local values in `.env.local` for:

- Database connection.
- Auth secret and app URL.
- CCAvenue merchant credentials and callback URLs.
- Email provider details.
- Storage provider details.
- Public site URL.

Database and Prisma commands:

```bash
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed
```

Build verification command:

```bash
npm run build
```

Current verification status:

- `npm run db:generate` passes.
- `npm run build` passes.
- `npm run db:seed` passes.
- `npm run lint` passes.
- `npm run test` passes.
- `npm run format:check` passes.
- `npm audit` reports no vulnerabilities.

Developer usage rules:

- Developer A should work mainly in `app/(store)` and `components/store`.
- Developer B should work mainly in `app/admin`, `components/admin`, `lib/db`, `lib/navigation`, and `prisma`.
- Developer C should work mainly in cart, checkout, order, payment, shipment, QA, and validation files.
- All developers must reuse shared constants from `lib/constants.ts`.
- All new UI must use theme tokens from `app/globals.css`.
- Product, category, and navigation data must become database-driven instead of hardcoded frontend arrays.
- Never commit `.env.local` or real secrets.
- Do not copy large static HTML blocks directly from the old UI. Convert the approved UI into reusable, data-driven components.

---

## 4. Technology Stack

Use a single Next.js monolith for v1.

| Layer         | Decision                                                                     |
| ------------- | ---------------------------------------------------------------------------- |
| Framework     | Next.js App Router                                                           |
| Language      | TypeScript                                                                   |
| Styling       | Tailwind CSS, with approved UI tokens recreated from the finalized prototype |
| Database      | PostgreSQL                                                                   |
| ORM           | Prisma                                                                       |
| Validation    | Zod                                                                          |
| Auth          | Auth.js or secure custom credentials auth                                    |
| Payments      | CCAvenue redirect checkout                                                   |
| Shipment      | Manual shipment entry in v1                                                  |
| Image Storage | Cloudinary or S3-compatible storage                                          |
| Email         | SMTP, Brevo, Resend, or confirmed provider                                   |
| Analytics     | Vercel Analytics and Google Analytics                                        |
| Testing       | Vitest and Playwright                                                        |
| Deployment    | Vercel                                                                       |

The frontend must not depend on static JSON after launch. `products.json` and static category data should only be used for initial seed/reference data.

---

## 5. Code Architecture

Recommended structure:

```text
app/
  (store)/
    layout.tsx
    page.tsx
    products/page.tsx
    search/page.tsx
    category/[slug]/page.tsx
    product/[slug]/page.tsx
    custom-boxes/page.tsx
    bulk-orders/page.tsx
    accessories/page.tsx
    industries/page.tsx
    about/page.tsx
    contact/page.tsx
    checkout/page.tsx
    order/[orderNumber]/page.tsx
    policies/[slug]/page.tsx
  admin/
    layout.tsx
    login/page.tsx
    dashboard/page.tsx
    products/page.tsx
    products/[id]/page.tsx
    categories/page.tsx
    navigation/page.tsx
    orders/page.tsx
    orders/[id]/page.tsx
    shipments/page.tsx
    coupons/page.tsx
    banners/page.tsx
    pages/page.tsx
    settings/page.tsx
  api/
    ccavenue/initiate/route.ts
    ccavenue/response/route.ts
    ccavenue/cancel/route.ts
    upload/route.ts
components/
  store/
  admin/
  common/
lib/
  auth/
  cart/
  db/
  navigation/
  payment/
  pricing/
  shipping/
  seo/
  validation/
prisma/
  schema.prisma
  seed.ts
```

Architecture rules:

- Reuse existing components, helpers, constants, validation schemas, and folder patterns before creating new files.
- Search the codebase before adding a new route, component, helper, type, or constant.
- Keep React components focused on rendering and interaction.
- Keep business logic in `lib/*`, not inside page components.
- Keep Prisma/database queries in server-only modules.
- Use Zod schemas for every form/server action/route handler payload.
- Use centralized types/constants for product status, order status, payment status, shipment status, roles, units, and pack quantities.
- Avoid copying large static HTML blocks directly into pages. Convert repeated UI patterns into reusable components.
- Server-render product/category pages for SEO and performance.
- Use client components only where interaction is required: cart drawer, filters, custom calculator, admin forms, upload widgets, modals.

---

## 6. Design System And UI Migration

The deployed finalized UI at `https://boxcare-c881.vercel.app/` should be treated as the approved visual direction.

### Single Theme Source Of Truth

Use one shared Box Care theme across the full application. Do not create separate visual systems for storefront, admin, checkout, custom builder, or content pages.

The theme must be defined once in the Next.js app through Tailwind v4 theme tokens and CSS variables in:

```text
app/globals.css
```

Initial theme tokens:

| Token                | Purpose                                                    |
| -------------------- | ---------------------------------------------------------- |
| `--boxcare-brown`    | Primary brand/nav/action color.                            |
| `--boxcare-orange`   | Accent color for highlights, quote actions, active states. |
| `--boxcare-beige`    | Warm background surface for sections and panels.           |
| `--boxcare-border`   | Standard border/divider color.                             |
| `--boxcare-charcoal` | Primary dark text and admin sidebar color.                 |
| `--boxcare-success`  | Success, paid, active, delivered states.                   |
| `--boxcare-warning`  | Pending, low-stock, attention states.                      |
| `--boxcare-danger`   | Error, failed, cancelled, destructive states.              |

Developer rules:

- Components must use theme utilities such as `bg-boxcare-brown`, `text-boxcare-orange`, and `border-boxcare-border`.
- Do not hardcode random hex colors inside components.
- If a new color is genuinely required, add it once as a named theme token before using it.
- Storefront can use the theme more expressively, following the finalized UI.
- Admin must use the same theme more quietly: mostly white/neutral surfaces, with Box Care colors for sidebar, actions, chips, alerts, and active states.
- Buttons, cards, forms, badges, status chips, tables, drawers, modals, and navigation must reuse shared component styles.
- Tailwind classes and global CSS variables are the source of truth; duplicated page-specific styling should be avoided.

Migration requirements:

- Recreate global tokens from `style.css` as Tailwind theme values and CSS variables.
- Preserve the approved header, navigation behavior, product cards, catalogue filters, cart drawer, footer, WhatsApp CTA, and custom builder styling.
- Convert repeated header/footer/cart/search UI into shared components.
- Replace hardcoded page content with database-backed data where content needs admin control.
- Keep mobile behavior equivalent or better than the static prototype.
- Ensure all pages support long product names, many categories, missing images, out-of-stock states, and empty result states.

Primary shared components:

- Offer bar.
- Store header.
- Desktop navigation.
- Mobile menu/navigation.
- Search bar and search suggestions.
- Category tile/card.
- Product card.
- Product image/gallery.
- Product price block.
- Variant selector.
- Quantity selector.
- Cart drawer.
- Checkout summary.
- WhatsApp quote button.
- Footer.
- Admin sidebar.
- Admin top bar.
- Admin data table.
- Admin form field group.
- Status chips.
- Upload component.
- Confirmation modal.
- Toast/alert.

---

## 7. Dynamic Navigation

Navigation must be admin-controlled.

The system must support:

- Header menus.
- Footer menus.
- Category menu/dropdown.
- Mobile navigation.
- Featured category blocks.
- Custom static links such as About, Contact, Bulk Orders, Custom Boxes, Policies.
- Category/product-linked items.
- External links if needed.
- Sort order.
- Active/inactive state.

Admin must be able to:

- Add a navigation item.
- Edit label and destination.
- Choose link type: category, product, page, policy, custom URL.
- Reorder navigation items.
- Hide/show items.
- Assign items to header, footer, category menu, mobile menu, or featured sections.

Validation rules:

- Category/product/page links must reference existing active records.
- Custom URLs must be valid.
- Duplicate labels are allowed only if destinations differ.
- Inactive categories/products should not appear in generated public menus unless explicitly allowed for preview.

Acceptance criteria:

- Adding a new active category in admin can make it appear in navigation without code changes.
- Reordering navigation in admin updates the storefront menu.
- Hiding a category removes it from navigation and listings but does not delete old order history.

---

## 8. Dynamic Product And Category Routing

All product and category pages must be generated from database records.

Category routes:

```text
/category/[slug]
```

Category page data:

- Name.
- Slug.
- Parent category if any.
- Description.
- Hero/category image.
- SEO title and description.
- Sort order.
- Featured flag.
- Active state.
- Product list.
- Filters based on available product attributes.

Product routes:

```text
/product/[slug]
```

Product detail data:

- Name.
- Slug.
- Category.
- Description.
- Images.
- Material.
- Dimensions.
- Variants.
- Pack quantities.
- MRP and selling price.
- Stock status.
- Availability.
- Custom quantity support.
- Related products.
- SEO metadata.
- WhatsApp quote link.

When admin adds a new product:

- Product detail route must work automatically at `/product/[slug]`.
- Product must appear in `/products` if active.
- Product must appear under `/category/[categorySlug]`.
- Product must be included in search.
- Product can appear in related products.
- Product must be included in sitemap when active.

Slug rules:

- Slugs must be unique.
- Admin can edit slugs before launch.
- After launch, changing a slug should create a redirect record or require confirmation.
- Duplicate slug submissions must show validation errors.

---

## 9. Data Model

Core database entities:

| Entity            | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `User`            | Admin user accounts and optional future customer accounts. |
| `Role`            | Admin role support.                                        |
| `Customer`        | Guest/customer profile snapshot and order lookup data.     |
| `Address`         | Shipping and billing addresses.                            |
| `Category`        | Product category tree and route metadata.                  |
| `Product`         | Product master record.                                     |
| `ProductVariant`  | Size/material/pack/SKU/stock/price options.                |
| `ProductImage`    | Ordered product images.                                    |
| `NavigationMenu`  | Header/footer/mobile/category menu containers.             |
| `NavigationItem`  | Dynamic menu items and destinations.                       |
| `Cart`            | Persistent guest/customer cart.                            |
| `CartItem`        | Cart line item with selected variant and quantity.         |
| `Order`           | Order header, totals, statuses, customer snapshot.         |
| `OrderItem`       | Immutable purchased product snapshot.                      |
| `Payment`         | CCAvenue payment attempt and verification data.            |
| `Shipment`        | Courier/tracking/status data.                              |
| `Coupon`          | Discount rules.                                            |
| `Banner`          | Home and promotional banners.                              |
| `PageContent`     | About, policies, contact content blocks.                   |
| `Setting`         | Store-level settings and feature values.                   |
| `NotificationLog` | Email/SMS/WhatsApp notification attempts.                  |
| `Redirect`        | Optional slug redirect support after launch.               |

Important modeling rules:

- Store all money in paise as integers.
- Store product/category slugs as unique indexed fields.
- Store order numbers as unique indexed fields.
- Store cart totals as calculated values, not trusted browser values.
- Store order items as immutable snapshots of product name, SKU, variant, dimensions, pack quantity, price, and quantity.
- Keep soft-delete or active/inactive state for products/categories so old orders remain readable.
- Keep timestamps on all business records.

---

## 10. Storefront Modules

### Home

The home page must preserve the finalized UI direction and show:

- Offer/store confidence messaging.
- Dynamic header navigation.
- Search.
- Featured categories.
- Popular or featured products.
- Custom boxes CTA.
- Bulk order CTA.
- Trust and service sections.
- Footer navigation.

Admin-controlled content:

- Offer strip.
- Banners.
- Featured categories.
- Featured products.
- Store contact/social links.

### Catalogue And Search

The catalogue must support:

- Category selection.
- Search by name, slug, size, material, category, SKU.
- Length/width/dimension filters.
- Price filter.
- Sorting.
- Empty state.
- Out-of-stock display.
- Add to cart.
- Request quote/WhatsApp actions.

Filters should be generated from available product/variant data where practical.

### Product Detail

The product detail page must support:

- Dynamic product content.
- Variant/pack selection.
- Editable dimensions where product type allows custom sizing.
- Custom quantity input where enabled.
- Server-validated price calculation.
- Related products.
- Add to cart.
- Buy/checkout action.
- WhatsApp quote action.

### Custom Box Builder

The approved custom box builder must become a production quote/enquiry flow.

It must capture:

- Box type.
- Material.
- Dimensions.
- Quantity.
- Print/customization preference.
- Uploaded artwork/logo if provided.
- Customer name.
- Phone.
- Email.
- Message/requirements.

V1 can submit as a quote enquiry record and optionally send email/WhatsApp notification. It does not need to create a paid order unless the business confirms exact pricing rules.

---

## 11. Cart, Checkout, And CCAvenue Payment

Replace the prototype `localStorage` cart with a persistent server-backed cart.

Cart requirements:

- Guest cart using secure cookie/session identifier.
- Optional customer-linked cart if customer login is enabled later.
- Add, update, remove line items.
- Recalculate prices server-side.
- Validate stock and active product/variant status.
- Preserve cart across pages.

Checkout requirements:

- Contact details.
- Shipping address.
- Optional billing/GST/company fields.
- Coupon validation.
- Shipping charge calculation.
- Server-side total calculation.
- Pending order creation before payment redirect.

CCAvenue flow:

1. Customer submits checkout.
2. Server validates cart, stock, prices, coupon, address, and shipping.
3. Server creates order with `PENDING_PAYMENT`.
4. Server creates payment attempt.
5. Server builds encrypted CCAvenue request.
6. Customer is redirected/posted to CCAvenue.
7. CCAvenue returns to response or cancel route.
8. Server decrypts and validates response.
9. Server updates payment/order status idempotently.
10. Customer sees success, failure, or cancelled page.

Security requirements:

- Never trust cart totals from the browser.
- Never expose CCAvenue working key to the client.
- Decrypt and validate CCAvenue response server-side.
- Make response handling idempotent.
- Keep failed/cancelled payment attempts for reconciliation.

---

## 12. Admin Panel

The admin panel is part of v1.

Admin routes:

- `/admin/login`
- `/admin/dashboard`
- `/admin/products`
- `/admin/products/[id]`
- `/admin/categories`
- `/admin/navigation`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/shipments`
- `/admin/coupons`
- `/admin/banners`
- `/admin/pages`
- `/admin/settings`

Admin modules:

| Module              | Required Capability                                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Dashboard           | Orders, revenue, pending payments, processing orders, shipped orders, low-stock summaries, recent activity.                 |
| Product Management  | Product CRUD, images, slug, category, descriptions, dimensions, material, variants, pack prices, stock, status, SEO fields. |
| Category Management | Category CRUD, parent category, slug, image, sort order, active state, featured flag, SEO fields.                           |
| Navigation Manager  | Header, footer, category menu, mobile menu, featured links, sort order, active state.                                       |
| Order Management    | Filters, order detail, customer info, order items, totals, payment status, shipment status, admin notes.                    |
| Shipment Management | Courier name, tracking number, tracking URL, shipment status, shipped/delivered dates.                                      |
| Coupon Manager      | Code, discount type/value, minimum order, validity dates, usage limit, active state.                                        |
| Banner Manager      | Home banners, offer strip, category promotions, active/inactive state.                                                      |
| Page Manager        | About, contact, privacy, terms, shipping policy, refund/cancellation policy.                                                |
| Settings            | Store contact, WhatsApp number, GST message, shipping rules, social links, SEO defaults.                                    |

Discount and offer management requirements:

- Admin must be able to create flat amount coupons and percentage coupons.
- Coupon fields must include code, discount type, discount value, minimum order amount, start date, end date, usage limit, per-customer usage limit if customer login is enabled, active/inactive status, and internal admin notes.
- Coupon validation must happen on the server during cart and checkout calculation.
- Checkout must reject expired, inactive, duplicate, over-limit, or minimum-order-failing coupons.
- Discount totals must be recalculated server-side before creating the pending order.
- Order records must store the applied coupon and discount amount as immutable snapshots.
- Admin must be able to activate/deactivate a coupon without deleting historical order data.
- Admin must be able to manage offer strip text, banner offers, and category promotion messages separately from actual coupon calculation.
- Storefront offer text must never be treated as pricing logic. Only validated coupon and pricing rules can change totals.
- V1 discount scope should stay simple: one coupon per order, cart-level discount only, no stacked coupons.

Admin role readiness:

- `SUPER_ADMIN`: all modules.
- `OPERATIONS`: orders, shipments, stock.
- `CATALOG`: products, categories, navigation, banners, content.

Admin permission matrix:

| Module         | SUPER_ADMIN                       | OPERATIONS                        | CATALOG               |
| -------------- | --------------------------------- | --------------------------------- | --------------------- |
| Dashboard      | View all                          | View operations summary           | View catalog summary  |
| Products       | Create, edit, delete, publish     | View and update stock             | Create, edit, publish |
| Categories     | Create, edit, delete, publish     | View only                         | Create, edit, publish |
| Navigation     | Create, edit, delete, publish     | View only                         | Create, edit, publish |
| Orders         | View, update, cancel/refund notes | View and update processing status | View only             |
| Shipments      | View and edit                     | Create and update tracking        | View only             |
| Coupons        | Create, edit, activate/deactivate | View only                         | View only             |
| Banners/Offers | Create, edit, activate/deactivate | View only                         | Create and edit       |
| Pages/Policies | Create, edit, publish             | View only                         | Create and edit       |
| Settings       | Full access                       | View shipping/contact settings    | View catalog settings |

V1 may start with one role in the UI, but the schema and authorization checks should be ready for these roles.

Acceptance criteria:

- Admin can add a category and make it appear on storefront navigation/listing without code changes.
- Admin can add a product and make `/product/[slug]` work without code changes.
- Admin can update stock and hide inactive products.
- Admin can update order status and shipment tracking.
- Admin can update header/footer/mobile navigation.
- Admin can create, edit, activate, deactivate, and validate coupon discounts.
- Admin can update offer strip and policy content.

---

## 13. Shipment Flow

Manual shipment is the v1 launch scope.

Admin can enter:

- Courier partner.
- Tracking number.
- Tracking URL.
- Shipment status.
- Internal note.
- Shipped date.
- Delivered date.

Customer order page must show:

- Order number.
- Order status.
- Payment status.
- Shipment status.
- Courier name.
- Tracking number.
- Tracking link.
- Order items and totals.
- Support contact.

Shipment statuses:

- `NOT_SHIPPED`
- `PROCESSING`
- `PACKED`
- `SHIPPED`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `RETURNED`

Future courier API integration:

- Compare Shiprocket, iThink Logistics, Delhivery One, and NimbusPost.
- Do not build full API integration until provider is confirmed.
- Keep shipment model flexible enough to store provider shipment IDs later.

---

## 14. Content, SEO, And Sitemap

SEO requirements:

- Server-render home, product, category, and policy pages.
- Dynamic metadata for products and categories.
- Product schema JSON-LD where possible.
- Sitemap generated from active products, categories, and pages.
- Robots.txt.
- Canonical URLs.
- Open Graph metadata.

Content-managed pages:

- About.
- Contact.
- Privacy Policy.
- Terms of Service.
- Shipping Policy.
- Refund/Cancellation Policy.

Sitemap acceptance criteria:

- New active product appears in sitemap.
- New active category appears in sitemap.
- Inactive products/categories are excluded.

---

## 15. Client Dependencies

Client must provide or confirm:

- Final logo and brand assets.
- Final product list.
- Product names, descriptions, dimensions, materials, SKUs, pack quantities, MRP, selling price, stock.
- Product/category images.
- Business legal name.
- GST number if applicable.
- Business address.
- Support phone, support email, WhatsApp number.
- Social links.
- Policy content.
- CCAvenue account status and credentials.
- Approved production domain.
- Pickup and return address.
- Courier preference if moving beyond manual shipment.
- Email/SMS provider details if notifications are required.

Use the existing `client-data-collection-checklist.md` as the base checklist, but update it if new fields become mandatory during development.

---

## 16. Development Phases

### Phase 1: Project Foundation

- Scaffold Next.js App Router with TypeScript.
- Configure Tailwind and base design tokens.
- Configure Prisma and PostgreSQL.
- Add auth foundation.
- Create base layouts for store and admin.
- Add shared component structure.

### Phase 2: Data Model And Seed

- Implement Prisma schema.
- Convert `products.json` and static category data into seed data.
- Create settings, navigation, page content, and admin seed records.
- Add slug validation and helper utilities.

### Phase 3: Storefront Migration

- Build home page from approved UI.
- Build dynamic header/footer/navigation.
- Build catalogue/search/category pages.
- Build product detail pages.
- Build custom box quote builder.
- Build bulk/accessories/industries/about/contact pages.

### Phase 4: Cart And Checkout

- Build persistent guest cart.
- Build cart drawer/page behavior.
- Build checkout form.
- Add pricing, coupon, GST display, shipping calculation.
- Create pending order flow.

### Phase 5: CCAvenue Payment

- Implement payment initiation route.
- Implement encrypted response/cancel handlers.
- Add payment status updates.
- Add success/failure/cancel pages.
- Add reconciliation-friendly payment logs.

### Phase 6: Admin Panel

- Build admin dashboard.
- Build product/category CRUD.
- Build navigation manager.
- Build order and shipment management.
- Build coupons, banners, pages, settings.
- Add role-ready authorization.

### Phase 7: QA And Launch

- Add automated tests.
- Run manual QA on desktop/tablet/mobile.
- Verify SEO and sitemap.
- Configure production env vars.
- Deploy to Vercel.
- Test one low-value live order after production payment approval.

---

## 17. Testing Plan

Unit tests:

- Price calculation.
- GST-inclusive display.
- Coupon calculation.
- Shipping calculation.
- Slug generation and duplicate prevention.
- Navigation link validation.
- Order status transitions.
- Payment status transitions.
- Shipment status transitions.
- CCAvenue encryption/decryption helpers.

Integration tests:

- Product CRUD.
- Category CRUD.
- Navigation CRUD.
- Product search.
- Dynamic category listing.
- Dynamic product detail lookup.
- Cart add/update/remove.
- Checkout creates pending order.
- CCAvenue response confirms/fails/cancels payment.
- Admin shipment update appears on customer order page.

E2E tests:

- Customer browses category, filters products, opens product detail, adds item to cart.
- Customer completes checkout through CCAvenue test flow.
- Customer sees payment success.
- Customer sees payment failure/cancelled path.
- Admin logs in and adds a category.
- Admin adds product under new category.
- New category appears in navigation.
- New product appears in listing/search/detail/sitemap without code changes.
- Admin updates shipment tracking.
- Customer views tracking on order page.

Manual QA:

- Desktop, tablet, mobile responsiveness.
- Search dropdown and empty states.
- Long product names and dimensions.
- Missing image fallback.
- Out-of-stock behavior.
- Form validation.
- Broken links.
- SEO previews.
- Sitemap and robots.txt.
- Admin permissions.
- Payment test credentials.
- Shipment tracking display.

---

## 18. Deployment And Environment

Required environment variables:

```text
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
CCAVENUE_MERCHANT_ID=
CCAVENUE_ACCESS_CODE=
CCAVENUE_WORKING_KEY=
CCAVENUE_MODE=test_or_live
CCAVENUE_REDIRECT_URL=
CCAVENUE_CANCEL_URL=
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM=
STORAGE_PROVIDER=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=
NEXT_PUBLIC_SITE_URL=
```

Production checklist:

- Vercel project created.
- PostgreSQL database created.
- Prisma migrations applied.
- First admin user seeded.
- Domain connected.
- SSL active.
- Storage configured.
- CCAvenue test credentials verified.
- CCAvenue live credentials configured.
- Payment callback URLs approved.
- Policy pages published.
- Product/category data reviewed.
- Sitemap generated.
- Analytics connected.
- Database backup enabled.
- One live low-value order tested.
- Rollback path confirmed.

---

## 19. V1 Scope And Future Scope

V1 required:

- Dynamic storefront.
- Dynamic categories/products.
- Admin product/category/navigation management.
- Cart and checkout.
- CCAvenue payment.
- Manual shipment.
- Order tracking.
- Content/policy management.
- SEO sitemap.
- Production deployment.

Future scope:

- Customer login and reorder.
- Courier API integration.
- Invoice PDF generation.
- GST report export.
- Bulk product import/export.
- WhatsApp notification automation.
- SMS automation.
- Reviews and ratings.
- Abandoned cart recovery.
- Multi-location inventory.
- PWA/mobile app integration.

---

## 20. Final Assumptions

- The deployed finalized UI at `https://boxcare-c881.vercel.app/` is approved and must guide the production UI.
- The production app will be built as a new Next.js codebase or migrated into a Next.js structure, depending on the repository decision at implementation start.
- The admin panel is included in v1.
- Dynamic navigation is included in v1.
- Dynamic product and category routes are included in v1.
- CCAvenue is the v1 payment gateway.
- Manual shipment is the v1 shipment method.
- Courier API integration is future scope until the provider is confirmed.
- Markdown is the required documentation format.
