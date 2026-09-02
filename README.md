# Box Care Next.js Development App

Production Next.js foundation for the Box Care ecommerce platform.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file:

```bash
copy .env.example .env.local
```

3. Fill `.env.local` with local development values. Do not commit real secrets.

4. Start the dev server:

```bash
npm run dev
```

## Common Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate
npm run db:studio
npm run db:seed
```

## Environment

`.env.example` is committed as documentation. `.env.local` and real env files are ignored by Git.

Required groups:

- App URL
- PostgreSQL database URL
- Auth secret and URL
- CCAvenue merchant credentials
- Email sender/provider settings
- Storage provider settings

## Developer Ownership

Developer A owns storefront/UI migration:

- Public store routes
- Header/footer/search/cart drawer shell
- Products, category, product detail, custom box builder UI
- Responsive polish

Developer B owns backend/admin/dynamic navigation:

- Prisma schema and seed data
- Product/category/admin CRUD foundation
- Dynamic navigation manager
- Settings, banners, pages, policies

Developer C owns commerce/shipment/QA:

- Cart and checkout contracts
- Order creation flow
- CCAvenue route handlers
- Manual shipment flow
- Order tracking and QA checklist

## Project Rules

- Use the single Box Care theme in `app/globals.css`.
- Do not hardcode random colors in components.
- Keep business logic in `lib/*`, not page components.
- Keep admin and storefront shared pieces in `components/common`.
- Never trust browser prices or totals during checkout.
- Never commit secrets.

## Notes

The current routes are placeholders so each developer has a safe starting point. Replace placeholders incrementally with real components and server data.
