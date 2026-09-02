# Box Care Strict Development Rules

> Mandatory reading before coding in the cloned project root.

## Project Boundary

- Do not create a new Next.js app.
- Work only inside the existing cloned project scaffold.
- Read `AGENTS.md` before coding because this project uses the latest Next.js behavior.
- Keep the deployed finalized UI at `https://boxcare-c881.vercel.app/` as the visual baseline.
- Convert the approved UI into reusable, data-driven components instead of copying large static HTML blocks.

## Git Workflow

- Always create a branch from the latest `main` branch.
- Do not work directly on `main`.
- Create a separate branch for each assigned task or workstream.
- Use clear branch names, for example `feature/storefront-home`, `feature/admin-products`, `feature/checkout-flow`, or `fix/mobile-header`.
- Keep commits focused on the assigned task.
- Pull the latest `main` before opening a pull request.
- Ask for review before merging into `main`.

Create and work on your branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

## Pull Request And Review Rules

- Use the PR template and fill every section.
- PR title format: `[Workstream] Short task summary`.
- Every PR must include what changed, screenshots for UI changes, test results, blockers, and follow-up notes.
- No PR should be merged without project lead review.
- Do not merge if `npm run build` fails.
- Do not mix unrelated storefront, admin, checkout, and refactor work in one PR.

## Daily Handoff Format

Each developer must share this at the end of the day:

```text
Name:
Branch:
Done:
Pending:
Blocked:
Pages/components touched:
Commands run:
Screenshots/notes:
Help needed:
```

## Environment And Secrets

- Do not commit `.env.local` or real secrets.
- Use `.env.example` as the only committed environment reference.
- Real database, auth, CCAvenue, email, storage, and site URL values must stay local or in the deployment provider.

## Code Ownership

- Developer A should work mainly in `app/(store)` and `components/store`.
- Developer B should work mainly in `app/admin`, `components/admin`, `lib/db`, `lib/navigation`, and `prisma`.
- Developer C should work mainly in cart, checkout, order, payment, shipment, QA, and validation files.
- Shared UI belongs in `components/common`.
- Shared business rules belong in `lib`.

## Code Standards

- Reuse existing files, components, constants, validation schemas, and helpers before creating new ones.
- Search the codebase before adding a new component, helper, type, route, or constant.
- Keep page files small. Pages should compose components and call data functions, not hold large UI or business logic.
- Use TypeScript types for props, API inputs, server action inputs, and data return values.
- Use Zod schemas from `lib/validation` for form, API, and server action validation.
- Use async server components for database-backed pages where possible.
- Use client components only for real browser interaction such as forms, drawers, filters, modals, uploads, and cart UI.
- Name components in PascalCase, hooks with `use`, helpers in camelCase, and constants in UPPER_SNAKE_CASE only when they are true constants.
- Keep one component responsible for one clear UI job.
- Move repeated UI into `components/common`, `components/store`, or `components/admin` based on ownership.
- Move repeated business logic into the correct `lib/*` folder.
- Do not place database queries directly inside random UI components; use clear data helpers or server actions.
- Do not use `any` unless approved in review. Prefer specific types or `unknown` with validation.
- Do not leave `console.log`, commented-out code, unused imports, or dead files in handoff work.
- Do not add new libraries without project lead approval.
- Do not rewrite working project structure just to match personal preference.
- Keep commits small enough for easy review.

## Do Not Recreate

- Do not create another cart system. Extend the planned cart flow in `lib/cart` and storefront cart components.
- Do not create another theme file. Use `app/globals.css`.
- Do not create another Prisma client. Use `lib/db/prisma.ts`.
- Do not create another constants file for statuses or roles. Use `lib/constants.ts`.
- Do not create duplicate product/category/navigation types if shared types already exist.
- Do not create hardcoded category/product pages when dynamic routes already exist.
- Do not add a second admin layout or storefront shell.

## UI And Theme

- Use theme tokens from `app/globals.css`.
- Do not add random one-off colors in components.
- Keep admin UI on the same Box Care theme, but quieter and more operational.
- Keep text readable and responsive on desktop, tablet, and mobile.

## Data And Routing

- Product, category, and navigation data must be database-driven.
- Do not hardcode new product or category routes.
- Product detail pages must use `/product/[slug]`.
- Category pages must use `/category/[slug]`.
- Navigation must come from admin-controlled data.
- Use shared constants from `lib/constants.ts`.
- Store money as integer paise.

## Product And Category Data Entry

- Product name, slug, category, status, description, price/pack pricing, stock, images, and SEO title are required for publish-ready products.
- Category name, slug, active state, sort order, navigation visibility, and SEO title are required for publish-ready categories.
- Slugs must be lowercase, unique, URL-safe, and stable after publishing.
- Images must have meaningful alt text.
- Long product names must be tested on product cards, search results, cart, checkout, and admin tables.
- Inactive products and categories must not appear in storefront navigation or sitemap.

## Commerce Rules

- Keep pricing, GST, coupon, stock, checkout, payment, and shipment logic out of React UI components.
- Validate checkout, coupons, stock, shipping, and payment server-side.
- Never trust browser prices, discounts, totals, or payment status.
- Admin coupon and offer text must not directly change pricing unless backed by validated coupon rules.
- Store order item prices and applied discounts as immutable snapshots.

## Coupon Test Rules

- Test valid flat discount coupons.
- Test valid percentage discount coupons.
- Test expired coupons.
- Test inactive coupons.
- Test invalid coupon codes.
- Test minimum-order failure.
- Test usage-limit failure.
- Test that one order cannot stack multiple coupons.
- Test that the final order stores the applied coupon and discount snapshot.

## Bug Report Format

```text
Title:
Page/route:
Device/browser:
Steps to reproduce:
Expected result:
Actual result:
Screenshot/video:
Severity:
Assigned owner:
```

## Deployment And Preview Rules

- Local branch changes must go through a PR.
- PR preview deployment must be checked for UI work.
- Production deployment should happen only after review and merge into `main`.
- Production env values must be configured in Vercel, not committed.
- One low-value test order must be completed after payment production approval.

## Handoff Checks

- Run `npm run build` before handoff.
- Run `npm run format:check` before handoff.
- Run relevant tests before handoff.
- Run `npm run db:generate` after Prisma schema changes.
- Note blockers clearly in the team workplan.
- Do not mark a task done if the page only has placeholder UI.
