# Copilot Instructions for AI Agents

## Project Overview
- **Framework:** Next.js (app directory, TypeScript)
- **Purpose:** Baby gift list management with admin and user flows
- **Key Tech:** Next.js, Prisma, Docker, Vercel, i18n, custom API routes

## Architecture & Structure
- **App Directory:**
  - `src/app/` uses Next.js app router. Pages and routes are colocated (e.g., `admin/users/new/page.tsx`).
  - API routes in `src/app/api/` (RESTful, e.g., `products`, `users`, `gemini`).
- **Database:**
  - Prisma schema in `prisma/schema.prisma`.
  - DB access via `src/lib/prisma.ts` and `src/lib/database/` modules.
- **Components:**
  - UI in `src/components/` (e.g., `ProductCard.tsx`, `UserLogin.tsx`).
- **State:**
  - Client state in `src/store/userStore.ts`.
- **i18n:**
  - Translations in `src/locales/` (JSON per language).

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Build:** `npm run build`
- **Lint:** `npx eslint .` (config: `eslint.config.mjs`)
- **DB Migrate:** `npx prisma migrate dev`
- **Docker:**
  - Build: `docker build -t baby-list .`
  - Compose: `docker-compose up`
- **Deploy:** Vercel (see README)

## Project Conventions
- **TypeScript strict mode** (`tsconfig.json`)
- **Path aliases:** `@/` → `src/`
- **ESLint:**
  - Unused vars prefixed with `_` are ignored
  - `any` is allowed
- **API:**
  - Use Next.js API routes for backend logic
  - Prisma for DB access
- **i18n:**
  - Use `src/lib/i18n.ts` for translation utilities
- **Testing:** No explicit test setup found; follow Next.js/Prisma best practices if adding

## Integration & Patterns
- **Prisma:** All DB access via `src/lib/prisma.ts` or `src/lib/database/`
- **API:** Custom endpoints in `src/app/api/` (RESTful, not GraphQL)
- **Docker:** Use for local dev and DB
- **Vercel:** For production deploys
- **i18n:** Use translation files and utilities

## Examples
- **Add a new admin page:**
  - Create `src/app/admin/[section]/[page].tsx`
- **Add a new API route:**
  - Create handler in `src/app/api/[resource]/route.ts`
- **Add a DB model:**
  - Edit `prisma/schema.prisma`, run `npx prisma migrate dev`, update access in `src/lib/database/`

## References
- [README.md](../README.md)
- [prisma/schema.prisma](../prisma/schema.prisma)
- [src/app/](../src/app/)
- [src/lib/](../src/lib/)
- [src/components/](../src/components/)

---

**If unsure about a pattern, check the referenced files or follow Next.js/Prisma idioms.**
