Last verified: 2026-10-16

# Build with Jeremy website (buildwithjeremy.com)

Jeremy's personal-brand site: Strategic Ops Partner / fractional COO for small service teams. Custom software is cross-sold to buildmysystem.co. Positioning, voice, ICP, fit criteria and page structure: `docs/agent-notes.md`.

## Stack and commands

Astro 5 (static) + React islands + MDX, Tailwind 4, Keystatic CMS for the blog (`/keystatic`, config `keystatic.config.ts`), hosted on Vercel (`vercel.json` holds redirects). API routes in `src/pages/api/`: Stripe checkout/subscribe/webhook (see `docs/stripe-integration.md`) and newsletter.

```bash
npm run dev
npm run build          # prebuild: check:claims; postbuild: check:tracking
npm run check:shared   # tokens.css must match buildmysystem-website
```

## Map

- Layout and SEO meta: `src/layouts/Layout.astro`; JSON-LD helpers `src/utils/schema.ts`
- Pages `src/pages/`, components `src/components/`, images `public/images/`
- Custom-software prices and Stripe price IDs: `src/config/pricing.ts`
- GA4 event contract: `src/config/tracking.mjs` (`docs/tracking.md`); update it with any CTA, service card, pricing control or page change
- Styles: `src/styles/tokens.css` is the canonical shared copy (edit here, copy to buildmysystem-website, run `check:shared`); site-only styles in `src/styles/global.css`; design doc `docs/design-system.md`

## Sources of truth

- Every claim and number: `~/Documents/BWJ-Marketing/proof/proof-points.md` (case studies in `proof/case-studies.md`). Not listed = not approved; `check:claims` enforces retired ones.
- Work status: Build Suite.

## Hard rules

- Never "BJ" as a monogram or acronym; short forms are "BUILD" or "BWJ".
- Every page: `<Layout>` with title, unique description and JSON-LD; one `<h1>`; descriptive link text; FAQ arrays feed both markup and `faqSchema()`. Full checklist in `docs/agent-notes.md`.

If this file is >60 days unverified, propose a diff at session start.
