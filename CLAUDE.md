# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at localhost:4321
npm run build        # Build to dist/ + Pagefind search indexing
npm run preview      # Preview production build locally
```

Search indexing only works after a full build — `npm run dev` won't have search results.

## Architecture

Astro 5 static site with Tailwind CSS v4, TypeScript, MDX content, and React islands.

### Content System

Blog posts live in `src/content/blog/` as `.md` or `.mdx` files. The content collection schema is in `src/content.config.ts` (not `src/content/config.ts`) using Zod validation with a glob loader pattern.

Key frontmatter fields: `title`, `pubDatetime`, `description`, `tags`, `featured`, `draft`, `unlisted`, `ogImage`, `heroImage`.

**Post filtering rules** (in `src/utils/postFilter.ts`):
- `draft: true` posts are hidden in production, visible in dev
- `unlisted: true` posts are always hidden from listings
- Scheduled posts respect `SITE.scheduledPostMargin` (15 min window)

**Path generation**: `src/utils/getPath.ts` maps file paths to URLs. Nested directories are preserved — `src/content/blog/2025/january/post.md` → `/posts/2025/january/post`.

### Configuration

- `src/consts.ts` — Primary site config (`SITE` object: metadata, pagination, feature flags)
- `src/constants.ts` — Social links (`SOCIALS`) and share links (`SHARE_LINKS`) with `active` toggles
- `src/config.ts` — Re-exports from both for backward compatibility

### Styling & Theming

Tailwind v4 via `@tailwindcss/vite` plugin (not PostCSS). Theme uses CSS custom properties defined in `src/styles/global.css`:
- Light: blue accent (#006cac), desert background pattern
- Dark: orange accent (#ff6b01), inverted background filter
- Theme toggle in `public/toggle-theme.js` persists to localStorage with 24h expiration, then falls back to system preference

Custom font: Atkinson (loaded from `src/assets/fonts/`).

### OG Image Generation

When `SITE.dynamicOgImage` is true, per-post OG images are generated at build time using Satori (JSX→SVG) + Resvg (SVG→PNG). Templates are in `src/utils/og-templates/`. Google Fonts (IBM Plex Mono) are fetched dynamically for rendering.

### Key Integrations

- **Search**: Pagefind — indexed at build time, client UI initialized via `requestIdleCallback`
- **RSS**: `/rss.xml` endpoint in `src/pages/rss.xml.ts`
- **PWA**: `@vite-pwa/astro` with CacheFirst strategies for fonts (1yr) and images (30d)
- **Analytics**: Vercel Analytics + Speed Insights mounted in `src/layouts/Layout.astro`
- **Sitemap**: Priority-based config in `astro.config.mjs` (homepage=1.0, recent posts=0.8, tags=0.1)
- **Structured Data**: JSON-LD schemas (BlogPosting, Person, WebSite) auto-generated per page

### Remark Plugins

- `remark-toc` — auto table of contents
- `remark-collapse` — collapsible TOC sections
- `src/utils/remarkLazyLoadImages.mjs` — custom plugin adding `loading="lazy"` to images

### Scripts

`scripts/poltergeist.js` — experimental AI-powered build fixer that catches build errors, queries Claude/GPT-4o for fixes, and auto-retries (max 5 attempts). Requires `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`.

## Conventions

- Trailing slashes: **never** (`trailingSlash: "never"` in astro.config)
- Import alias: `@/` maps to `src/`
- Slugification uses `lodash.kebabcase` via `src/utils/slugify.ts`
- Tags default to `["others"]` when unspecified
- View Transitions enabled for smooth page navigation; use `transition:persist` for stateful components
