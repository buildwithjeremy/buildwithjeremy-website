# Agent notes (moved from CLAUDE.md, 2026-10-16)

Positioning, voice and page intent that used to live in `CLAUDE.md`. Claims and numbers are never written here: they come from `~/Documents/BWJ-Marketing/proof/proof-points.md` (case studies: `proof/case-studies.md` in the same folder).

## Positioning

Strategic Ops Partner / fractional COO for established small service teams scaling without chaos. Core line: "Scale without the chaos." Partnership, not projects; outcomes (throughput, capacity, calm ops) over tools.

- Primary ICP: established service businesses, roughly $500K to $5M revenue, remote or distributed ops, recurring admin load or scheduling complexity. Also startups and enterprise clients wanting ops expertise.
- Great fit: willing to standardize and document; ready to invest in systems that scale; handoff or scheduling pain.
- Not a fit: ecommerce or manufacturing; onsite-heavy ops where the bottleneck is physical; wants a one-hour "Zapier trick" with no process ownership; not ready to change how things work.
- Offers (live on `src/pages/services/index.astro`): Strategic Ops Partner retainer, 2-Week Systems Sprint, AI Audit & Team Training. Custom software is cross-sold to buildmysystem.co.
- Primary CTA: "Book a Free Systems Audit Call" → `/contact` (Work With Me, Calendly embed).

## Voice

- Warm but credible; operator first, builder second; direct and practical; no jargon.
- Key messages: "I make it stick: SOPs, training, and handoff", "Diagnose → Design → Deploy → Discipline", "More throughput without more headcount", "Off-the-shelf when it fits, custom when it's smarter".
- Keep warmth ("sticky notes, spreadsheets, and stress", "duct tape and to-do lists", "runs like a machine"); add credibility only with approved proof points.
- Avoid: corporate language, technical jargon, specific timeframe promises, pushy sales language, long tool lists.

## Page structure (as designed)

- Home: hero (eyebrow, headline, proof line, dual CTAs) → stats bar → "What changes when ops are dialed in" → Diagnose/Design/Deploy/Discipline → 3 case studies → services preview → testimonials → trust badges (below testimonials, not in hero) → FAQ → final CTA.
- About: "I'm Jeremy, operator first, builder second." → credentials → journey (Google, entrepreneurship, tech + scrappiness) → what to expect → how I help → result → how I work → trust badges → CTA.
- Services: "Choose the engagement that fits." → 3 tier cards → Build vs Buy (off-the-shelf, automation, custom) → FAQ → CTA.
- Contact: "Let's fix the bottleneck." → left: what happens on the call, fit / not-a-fit; right: Calendly → alt contact → FAQ.
- Hero component takes `eyebrow` and `proofLine` (items separated by •). Theme toggle lives in the footer only.

## SEO checklist detail

- `<Layout>` on every page: `title` as `{Page Title} | Build with Jeremy`, unique 120 to 160 char `description`, `jsonLd` (at least `breadcrumbSchema()` except the homepage).
- Schema helpers in `src/utils/schema.ts`: home = organization + website (+ faq); about = person + breadcrumb; service = service + breadcrumb (+ faq); blog = blogPost + breadcrumb + `type="article"` + `publishDate`; checkout = `noindex={true}`, no schema.
- FAQs: one typed array in frontmatter feeds both `faqSchema()` and the rendered `<details>`.
- One `<h1>` per page, no skipped heading levels. Descriptive link text (never "Learn more", "Click here", "Read more").
- Images: `.webp`, descriptive `alt`, `loading="eager"` above the fold, `lazy` below; heroes `rounded-2xl shadow-2xl`, headshots `rounded-2xl`.
- og:image defaults to `/og-image.jpg`; Layout makes it absolute and handles site_name, theme-color, apple-touch-icon.
