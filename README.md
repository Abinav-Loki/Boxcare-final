# Box Care Next.js Development App

Production Next.js foundation for the Box Care ecommerce platform.

## Project Docs

Start from the cloned project root on your machine.

- `doc/box-care-final-ui-nextjs-implementation-plan.md` is the full architecture and feature plan.
- `doc/box-care-strict-development-rules.md` is mandatory before coding.
- `AGENTS.md` contains Next.js-specific agent/runtime rules and should not be removed.

## Git Workflow

Create a branch from the latest `main` and work on that branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task-name
```

Do not work directly on `main`. Work on your created branch and ask for review before merging.

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
npm run format
npm run format:check
npm run test
npm run test:watch
npm run test:e2e
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

- Read `doc/box-care-strict-development-rules.md` before starting work.
- Reuse existing components, helpers, constants, and validation schemas before creating new ones.
- Search the codebase before adding a new route, component, helper, type, or constant.
- Use the single Box Care theme in `app/globals.css`.
- Do not hardcode random colors in components.
- Keep business logic in `lib/*`, not page components.
- Keep admin and storefront shared pieces in `components/common`.
- Never trust browser prices or totals during checkout.
- Never commit secrets.

## Notes

The current routes are placeholders so each developer has a safe starting point. Replace placeholders incrementally with real components and server data.
