# Build with Jeremy - Project Guidelines

## Brand Abbreviations
- **Never use "BJ"** as a monogram or acronym for the brand
- Preferred short form: **"BUILD"**
- Alternative: **"BWJ"**

## About This Project
This is the website for "Build with Jeremy" - a consulting business positioning Jeremy as a **Strategic Ops Partner / Fractional COO** for established small teams looking to scale without chaos.

**Owner**: Jeremy Pittman
**Background**: 12 years at Google (ops, programs, product launches), now full-time consultant
**Target Audience**:
- **Primary ICP**: Established service businesses with $500K-$5M revenue, remote/distributed operations, recurring admin load or scheduling complexity
- **Also serves**: Startups getting going, enterprise clients seeking ops expertise
- **Best fit**: Teams willing to standardize and document processes, ready to invest in systems that scale

---

## Tech Stack
- **Framework**: Astro 5.x (static site generation)
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **CMS**: Keystatic (git-based, at `/keystatic` route)
- **Hosting**: Vercel
- **Calendar**: Calendly (embedded on Work With Me page)
- **Fonts**: Google Sans Flex (primary), Inter (fallback)

---

## Brand Positioning

### Core Value Proposition
**"Scale without the chaos."**
- Strategic ops partner, not a one-off freelancer
- Fractional COO support for teams where ops is the bottleneck
- Focus on outcomes: throughput, capacity, calm operations

### Key Proof Points
Source of truth for every claim: `~/Documents/BWJ-Marketing/proof/proof-points.md`. Use APPROVED claims as written, remove RETIRED ones on sight, and if a number is not there it is not approved.
- 12 years at Google in operations, programs, and product launches
- 30+ client engagements to date
- 100% Job Success Score on Upwork, Top Rated
- Systems live in the trades, field services, logistics, home services, professional services, fitness, and legal

### Service Tiers (3 offerings)
1. **Strategic Ops Partner (Retainer)** - Fractional COO support, ongoing partnership
2. **2-Week Systems Sprint** - Fast clarity + momentum, try-before-retainer
3. **AI Audit & Team Training** - Practical AI adoption, training, implementation

### Primary CTA
"Book a Free Systems Audit Call" → routes to Work With Me page with Calendly

---

## Design System

Colors, typography, buttons, cards, theme-aware classes and dark mode are documented once, in
`docs/design-system.md`, and shared byte-for-byte with buildmysystem-website through
`src/styles/tokens.css`. This repo holds the canonical copy: edit `tokens.css` here, copy it to
buildmysystem-website in the same sitting, and run `npm run check:shared`. Site-only styles go in
`src/styles/global.css`, never in `tokens.css`.

---

## Voice & Tone

### Brand Voice
- **Warm but credible**: Approachable expert with serious chops
- **Operator first, builder second**: Understands real business pain points
- **Direct and practical**: Focus on outcomes, not tools
- **No jargon**: Simple, clear language

### Key Messages (New Positioning)
- "Scale without the chaos"
- "I make it stick—SOPs, training, and handoff"
- "Diagnose → Design → Deploy → Discipline"
- "Partnership, not projects"
- "More throughput without more headcount"

### Phrases to Use
- "Bottleneck" (focus on removing operational bottlenecks)
- "Systems that run on autopilot"
- "Fractional COO support"
- "Strategic Ops Partner"
- "Clarity + momentum fast"
- "Off-the-shelf when it fits, custom when it's smarter"

### Phrases to Avoid
- Overly corporate language
- Complex technical jargon
- Promises of specific timeframes (no "in just 2 weeks!")
- Pushy sales language
- Long tool lists (keep high-level, outcomes-focused)

### Tone Blending
**Keep the warmth** from phrases like:
- "sticky notes, spreadsheets, and stress"
- "duct tape and to-do lists"
- "runs like a machine"

**Add credibility** with:
- "30+ client engagements to date"
- "12 years at Google"
- Anonymized case studies from `proof/case-studies.md` in the proof bank (never invent an outcome)

---

## Component Patterns

### Hero Component
- Supports `eyebrow` prop for "Strategic Ops Partner" text
- Supports `proofLine` prop for credentials (e.g., "12 years at Google • Verified on Upwork • 100% Job Success")
- Proof line uses bullet separators (•) between items

### Trust Badges
- Display on homepage (below testimonials, not in hero)
- Display on About page
- Format: "Top Rated on Upwork • 100% Job Success • 12 years at Google • 30+ client engagements to date"

---

## Page Structure

### Homepage Sections (in order)
1. **Hero** - Eyebrow, headline, subheadline, proof line, dual CTAs
2. **Stats Bar** - 30+ Client Engagements, 100% Upwork Job Success, 12 Years at Google
3. **"What changes when ops are dialed in"** - Benefit bullets
4. **Process Framework** - Diagnose → Design → Deploy → Discipline
5. **Case Studies** - 3 anonymized examples with outcomes
6. **Services Preview** - 3-tier cards with color-coded badges
7. **Testimonials** - 4 real Upwork reviews
8. **Trust Badges** - Upwork credentials row
9. **FAQ** - Accordion style
10. **Final CTA** - "Want your ops to feel calm again?"

### About Page Sections
1. **Hero** - "I'm Jeremy—operator first, builder second."
2. **Credentials Bar** - 3 stats
3. **My Journey** - 3 cards (Google, Entrepreneurship, Tech+Scrappiness)
4. **What you can expect** - 4 items
5. **How I Help** - 3 cards
6. **The Result** - 3 outcome cards
7. **How I Work** - 4 value cards
8. **Trust Badges** - Upwork credentials
9. **CTA** - Book a Free Systems Audit

### Services Page Sections
1. **Header** - "Choose the engagement that fits."
2. **3 Service Tier Cards** - Strategic Ops Partner, 2-Week Sprint, AI Audit
3. **Build vs Buy** - 3 columns (Off-the-shelf, Automation, Custom)
4. **FAQ** - Services-specific questions
5. **CTA** - "Not sure which option fits?"

### Work With Me (Contact) Page Sections
1. **Header** - "Let's fix the bottleneck."
2. **2-Column Layout**:
   - Left: What happens on the call, Great fit checklist, Not a fit checklist
   - Right: Calendly embed
3. **Alternative Contact** - Email, LinkedIn
4. **Quick Questions** - FAQ accordion

### Theme Toggle
- Footer only, small and unobtrusive (mechanism: `docs/design-system.md`)

---

## Fit Check Criteria

### Great Fit
- Service/logistics businesses with remote or distributed ops
- Recurring admin load, scheduling complexity, or handoff issues
- Willingness to standardize and document processes
- Ready to invest in systems that scale

### Not a Fit
- Ecommerce or manufacturing operations
- Onsite-heavy operations where bottlenecks are physical
- Looking for a one-hour "Zapier trick" with no process ownership
- Not ready to make changes to how things work

---

## Image Guidelines
- Use `.webp` format for photos
- Hero images: `rounded-2xl shadow-2xl`
- Headshots: `rounded-2xl`
- Always include descriptive `alt` text

---

## SEO Requirements

Every page must follow these rules. They are not optional.

### Layout Props (every page)
Every `<Layout>` tag must include:
- `title` — format: `{Page Title} | Build with Jeremy`
- `description` — unique, 120-160 characters, include primary keyword
- `jsonLd` — at minimum a `breadcrumbSchema()` (except homepage)

Additional props when applicable:
- `type="article"` + `publishDate` for blog posts
- `noindex={true}` for transactional/checkout pages
- `image` for pages with a custom og:image

### JSON-LD Structured Data
Import schema helpers from `src/utils/schema.ts`. Every page type needs:
- **Homepage**: `organizationSchema()` + `websiteSchema()` + `faqSchema()` if FAQs present
- **About**: `personSchema()` + `breadcrumbSchema()`
- **Service pages**: `serviceSchema()` + `breadcrumbSchema()` + `faqSchema()` if FAQs present
- **Blog posts**: `blogPostSchema()` + `breadcrumbSchema()` + `type="article"`
- **All other pages**: `breadcrumbSchema()` at minimum
- **Checkout/transactional**: `noindex={true}`, no schema needed

### Link Text
**Never use generic link text.** Links must describe their destination:
- "Learn more" — never use
- "Click here" — never use
- "Read more" — never use

Instead use descriptive text:
- "Explore Strategic Ops Partner"
- "View the 2-Week Sprint details"
- "Read: How to streamline your ops"

### Images
- Always include descriptive `alt` text (never empty `alt=""`)
- Use `.webp` format for photos
- Hero/above-fold images: `loading="eager"`
- Below-fold images: `loading="lazy"`

### FAQ Sections
When a page has FAQ `<details>` elements:
1. Define FAQs as a typed array in frontmatter: `{ question: string; answer: string }[]`
2. Pass to `faqSchema(faqs)` in the `jsonLd` prop
3. Render the `<details>` elements by iterating over the same array (single source of truth)

### Headings
- Every page must have exactly one `<h1>`
- Use proper hierarchy: h1 → h2 → h3 (don't skip levels)

### Meta Defaults
- Default og:image: `/og-image.jpg` (handled by Layout)
- og:image is automatically resolved to an absolute URL by Layout
- `og:site_name`, `theme-color`, and `apple-touch-icon` are handled globally in Layout

---

## File Locations
- Styles: `src/styles/tokens.css` (shared, canonical) + `src/styles/global.css` (site-only)
- Design system doc: `docs/design-system.md`
- Layout: `src/layouts/Layout.astro`
- Components: `src/components/`
- Pages: `src/pages/`
- Images: `public/images/`
