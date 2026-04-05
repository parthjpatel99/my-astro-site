# AGENTS.md

Personal portfolio + blog built with Astro. Deployed to Vercel at parthjpatel.me.

## Build & Test

- Dev server: `npm run dev` (localhost:4321)
- Production build: `npm run build` (also runs Pagefind search indexing)
- Preview build: `npm run preview`
- No test suite, linter, or formatter is configured — `npm run build` is the primary verification

## Architecture Overview

Astro 5 static site with Tailwind CSS v4, TypeScript, MDX content collections, and React islands.

```
src/
├─ pages/           → File-based routing (index, about, search, posts/[id], rss.xml)
├─ content/blog/    → Markdown/MDX blog posts with Zod-validated frontmatter
├─ layouts/         → Page wrappers (Layout, BlogPostLayout, PostDetails)
├─ components/      → Reusable Astro components
├─ styles/          → Tailwind imports + CSS custom property theme system
├─ utils/           → Post filtering, sorting, slugs, OG image generation, remark plugins
├─ consts.ts        → Site metadata, pagination, feature flags (SITE object)
├─ constants.ts     → Social links + share links with active toggles
└─ config.ts        → Re-exports from consts.ts and constants.ts
```

## Agent Rules

### Rule 1: Build verification before completion

After making changes to any `.astro`, `.ts`, `.tsx`, `.mdx`, `.md`, or `.css` file, you MUST run `npm run build` and confirm it succeeds before declaring work complete or committing. A passing build is the only acceptance criterion — there is no test suite. If the build fails, fix the error and rebuild. Do not commit broken builds.

### Rule 2: Blog post frontmatter validation

When creating or editing blog posts in `src/content/blog/`, every post MUST have these frontmatter fields:
- `title` — non-empty string
- `pubDatetime` — valid ISO date (YYYY-MM-DD or full ISO 8601)
- `description` — non-empty string
- `tags` — array of strings (defaults to `["others"]` if omitted)

Do not create posts missing these fields. The PostToolUse hook will automatically validate frontmatter after edits.

### Rule 3: Import and path conventions

- Always use the `@/` import alias instead of relative paths (e.g., `import { SITE } from "@/config"` not `../../config`)
- Never add trailing slashes to internal links — the site is configured with `trailingSlash: "never"`
- Use `lodash.kebabcase` (via `src/utils/slugify.ts`) for any new slug generation

### Rule 4: Styling discipline

- Use Tailwind utility classes and CSS custom properties from `src/styles/global.css` for all styling
- Every visual element must work in both light and dark themes — test both
- Do not add inline styles, new CSS files, or additional styling libraries
- Reference existing theme variables (`--color-accent`, `--color-bg`, etc.) rather than hardcoding color values

### Rule 5: No unnecessary dependencies

Do not add new npm packages without explicit user approval. This is a lightweight static site — prefer native browser APIs, Astro built-ins, and existing dependencies over new packages.

## Conventions & Patterns

- Content schema lives in `src/content.config.ts` — not `src/content/config.ts`
- Required post frontmatter: `title`, `pubDatetime`, `description`, `tags`
- Tags default to `["others"]`; slugified via `lodash.kebabcase`
- Nested blog directories map to URLs: `blog/2025/jan/post.md` → `/posts/2025/jan/post`
- Import alias: `@/` → `src/`
- Trailing slashes: never (`trailingSlash: "never"`)
- View Transitions enabled; use `transition:persist` for stateful components

## Styling

- Tailwind v4 via `@tailwindcss/vite` — no PostCSS config exists or is needed
- Theme colors are CSS custom properties in `src/styles/global.css`, not Tailwind config
- Light: blue accent (#006cac), desert background; Dark: orange accent (#ff6b01), inverted filter
- Always support both light and dark mode when adding visual elements
- Custom font: Atkinson (from `src/assets/fonts/`)

## Gotchas

- Search only works after `npm run build` — dev mode has no Pagefind index
- `draft: true` posts show in dev but are excluded from production builds
- OG images are generated at build time (Satori + Resvg) — templates in `src/utils/og-templates/`
- Theme toggle persists to localStorage with 24h expiry, then falls back to system preference
- Do not introduce new frameworks, styling libraries, or package managers

## Hooks & Automation

This repo uses Claude Code hooks defined in `.claude/settings.json`:

- **PostToolUse (Edit/Write)**: Automatically validates frontmatter when blog post files are edited. Runs `scripts/validate-frontmatter.sh` on content files.
- **Stop**: Warns if source files have been modified but `npm run build` hasn't been run, reminding the agent to verify the build before finishing.
