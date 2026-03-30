# Copilot Instructions

## Build & Dev Commands

- **Package manager:** pnpm
- **Dev server:** `pnpm dev`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`
- **Format:** `pnpm format`
- **Type check:** `pnpm typecheck` (runs `astro check`)

There is no test suite configured.

## Architecture

This is an Astro 6 blog site using React for interactive components, Tailwind CSS v4, and shadcn/ui (base-nova style with @base-ui/react primitives).

**Content layer:** Blog posts are Markdown files in `src/data/blog/`. The collection schema is defined in `src/content.config.ts` using Astro's `glob` loader. Posts have frontmatter fields: `title`, `description`, `pubDatetime`, `tags`, and optional `featured`, `draft`, `modDatetime`, `ogImage`, `canonicalURL`.

**Layouts:** `Layout.astro` is the base layout (SEO meta, OG tags, theme script). `PostLayout.astro` wraps individual blog posts with header/footer and prose styling.

**Pages:** File-based routing under `src/pages/`. Dynamic routes use `[slug].astro` and `[...page].astro` patterns. RSS feed is generated via `rss.xml.ts`.

**Components:** Astro components (`.astro`) handle page-level UI (Header, Footer, PostCard, Pagination, Tag). React components (`.tsx`) are used only for interactive widgets requiring client-side state (e.g., ThemeToggle with `client:load`).

**UI primitives:** shadcn/ui components live in `src/components/ui/` and are built on `@base-ui/react` (not Radix). Add new ones with `npx shadcn@latest add <component>`.

## Key Conventions

- **Path alias:** `@/*` maps to `./src/*` (configured in tsconfig.json and components.json).
- **Class merging:** Use the `cn()` utility from `@/lib/utils` to merge Tailwind classes. Prettier is configured to sort Tailwind classes in `cn()` and `cva()` calls.
- **Styling:** Tailwind v4 with `@import "tailwindcss"` and `@theme inline` in `src/styles/global.css`. Colors use OKLch color space. Dark mode uses the `.dark` class on `<html>`.
- **Formatting:** Prettier with no semicolons, double quotes, 2-space indent, trailing commas (es5). Astro files use the `astro` parser.
- **Linting:** ESLint flat config targeting `.ts`/`.tsx` files only with TypeScript, React Hooks, and React Refresh rules.
- **Blog utilities:** Helper functions in `src/utils/` handle post sorting, tag extraction, tag filtering, and date formatting.
- **Site config:** Global constants (author, title, pagination settings, timezone) are in `src/config.ts`.
