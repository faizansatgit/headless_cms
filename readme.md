# Store Transform — Headless WordPress + Next.js

A **Next.js 14** (Pages Router) front end for a **WordPress** backend used in headless mode: **blog and pages** over **WPGraphQL**, **WooCommerce** over the **Store REST API** (`/wp-json/wc/store/v1`). Styling uses **Tailwind CSS**.

## What’s in the app

| Area | Source | Notes |
|------|--------|--------|
| **Marketing home** | Static Next page | Hero + link to shop |
| **Shop listing & PDP** | Woo Store API | ISR (`revalidate: 60`) |
| **Cart & checkout** | Woo Store API via Next API routes | Cart token in **HttpOnly** cookie |
| **Blog** | WPGraphQL | Posts, categories, load-more through `/api/posts/load-more` |
| **CMS pages** | WPGraphQL | Dynamic `[pageSlug]`; slugs reserved for app routes are excluded |
| **Comments** | WPGraphQL mutation | Submitted through `/api/comment` |
| **Contact form** | Next API only | `/api/form` validates input (no mailer wired by default) |
| **On-demand revalidation** | Next | `/api/revalidate` with `REVALIDATION_SECRET` |

## Tech stack

- **Next.js** `^14.2`, **React** 18  
- **Tailwind CSS** 3, PostCSS, Autoprefixer  
- **date-fns** for dates on the blog  
- **ESLint** (`eslint-config-next`)

## Project layout (high level)

```
pages/           App routes + pages/api/* (REST proxies, revalidate, forms)
components/      UI (SiteHeader, SiteFooter, cart, shop, blog, comments)
lib/             WPGraphQL client, posts/pages/seo/comments, Woo helpers, input guards
styles/          Global CSS (Tailwind entry)
```

- **`lib/graphqlRequest.js`** — POSTs to `{WORDPRESS_URL}/graphql`; optional `Authorization: Bearer` from server env.  
- **`lib/wcStoreServer.js`** — Server-side Woo Store calls with nonce + `Cart-Token` cookie handling.  
- **`lib/graphqlInputGuards.js`** — Validates slugs/cursors/taxonomy before building GraphQL strings.

## Environment variables

Create **`.env.local`** (see `.gitignore`; do not commit secrets).

| Variable | Scope | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_WORDPRESS_URL` | Client + server | WordPress site origin (no trailing slash). **Must be `https` in production.** |
| `NEXT_PUBLIC_SITE_URL` | Build / SEO | Public URL of this Next app (e.g. canonical blog base). Defaults to `http://localhost:3000` where used. |
| `WORDPRESS_AUTH_REFRESH_TOKEN` | Server only | Optional JWT for authenticated WPGraphQL requests. Never expose as `NEXT_PUBLIC_*`. |
| `REVALIDATION_SECRET` | Server only | Shared secret for `/api/revalidate` query `secret`. |

**Image domains** for `next/image` are derived from `NEXT_PUBLIC_WORDPRESS_URL` plus a default host in `next.config.js`.

## Scripts

```bash
npm run dev    # development server (default http://localhost:3000)
npm run build  # production build
npm run start  # production server
npm run lint   # ESLint
```

## WordPress / WooCommerce expectations

- **WPGraphQL** (and schema for posts, pages, categories, comments, SEO if used).  
- **WooCommerce** with the **Store API** enabled and reachable from the Next server (CORS / cookies as needed for your host).  
- For **checkout**, the front end relies on Woo Store API flows proxied under `pages/api/wc/*`.

## Security notes (implemented in this repo)

- GraphQL **variables** for comment mutations; validated slugs/cursors for post queries.  
- **Load more** posts only via **`POST /api/posts/load-more`** (not direct browser → WP GraphQL).  
- Revalidation uses **constant-time** secret comparison; global response headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) in `next.config.js`.  
- **`.env`** and **`/db/*.sql`** are gitignored — avoid committing dumps or keys.

## Naming

The npm package name is still **`nextjs-blog`**; the product surface is a **shop + blog** backed by one WordPress instance.

---

*Last reviewed: project structure and env usage as of the current codebase.*




Wordpress URL: 
https://dev-headless-next.pantheonsite.io