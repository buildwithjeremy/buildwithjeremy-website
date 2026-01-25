# Build with Jeremy - Project Guidelines

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
- 12 years at Google
- $5M+ client ARR enabled
- 100% Upwork Job Success
- Verified on Upwork, Top Rated

### Service Tiers (3 offerings)
1. **Strategic Ops Partner (Retainer)** - Fractional COO support, ongoing partnership
2. **2-Week Systems Sprint** - Fast clarity + momentum, try-before-retainer
3. **AI Audit & Team Training** - Practical AI adoption, training, implementation

### Primary CTA
"Book a Free Systems Audit Call" → routes to Work With Me page with Calendly

---

## Brand Colors

### Primary Palette
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Brand Purple** | #5565f1 | `--color-brand` | Primary brand color, links, navigation active states, general accents |
| **Primary Blue** | #122fed | `--color-primary` | Authority/trust elements, headings, Strategic Ops Partner service |
| **Accent Green** | #4dfe43 | `--color-accent` | CTAs, highlights, success indicators, stats numbers, checkmarks, 2-Week Sprint service |

### Color Usage Rules
1. **Section-level consistency**: All icons/elements within a section should use the same color
2. **Accent Green for action/success**: Stats numbers, checkmarks, positive outcomes, highlights
3. **Primary Blue for authority**: Experience headings, trust indicators
4. **Brand Purple for identity**: Links, navigation, general UI accents, AI Audit service
5. **Service card differentiation**:
   - Primary Blue/Light for "Strategic Ops Partner" (featured)
   - Accent Green for "2-Week Sprint"
   - Brand Purple for "AI Audit"

### CSS Classes
- `text-brand` / `bg-brand` - Brand purple
- `text-primary-color` / `bg-primary-color` - Deep blue
- `text-accent` / `bg-accent` - Bright green
- `text-accent-dark` - Darker green for icons on light backgrounds
- `theme-bg-primary`, `theme-bg-secondary`, `theme-text-primary`, etc. - Theme-aware classes

---

## Typography

### Font Stack
```css
font-family: 'Google Sans Flex', 'Inter', system-ui, sans-serif;
```

### Headings
- Use `font-bold` (700 weight)
- H1: `text-4xl sm:text-5xl lg:text-6xl`
- H2: `text-3xl md:text-4xl`
- H3: `text-xl` or `text-lg`

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
- "$5M+ ARR enabled"
- "12 years at Google"
- Anonymized case studies with real outcomes

---

## Component Patterns

### Hero Component
- Supports `eyebrow` prop for "Strategic Ops Partner" text
- Supports `proofLine` prop for credentials (e.g., "12 years at Google • Verified on Upwork • 100% Job Success")
- Proof line uses bullet separators (•) between items

### Buttons
- `.btn-primary` - Brand purple, main CTAs
- `.btn-secondary` - Primary blue
- `.btn-accent` - Bright green (use sparingly)
- `.btn-outline` - Outlined brand purple

### Cards
- Use `rounded-xl` or `rounded-2xl`
- Border: `border` with `style="border-color: var(--border-color);"`
- Hover: `hover:border-accent` or similar subtle effect

### Icons in Sections
- Keep icon colors consistent within each section
- Use `bg-{color}/10` for icon backgrounds
- Standard sizes: `h-12 w-12` (small), `h-16 w-16` (large)

### Stats/Numbers
- Use `text-accent` for stat values
- Large bold numbers: `text-3xl md:text-5xl font-bold`

### Trust Badges
- Display on homepage (below testimonials, not in hero)
- Display on About page
- Format: "Top Rated on Upwork • 100% Job Success • $10K+ earned"

---

## Page Structure

### Homepage Sections (in order)
1. **Hero** - Eyebrow, headline, subheadline, proof line, dual CTAs
2. **Stats Bar** - $5M+ ARR, 2× Output, 12 Years at Google
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
- Located in footer only (not header)
- Small and unobtrusive
- Uses JavaScript-based icon switching

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

## SEO Defaults
- Title format: `{Page Title} | Build with Jeremy`
- Default description: "Strategic ops partner helping established small teams scale without chaos. 12 years at Google. Fractional COO support, systems sprints, and AI adoption."
- Include Open Graph and Twitter meta tags

---

## File Locations
- Styles: `src/styles/global.css`
- Layout: `src/layouts/Layout.astro`
- Components: `src/components/`
- Pages: `src/pages/`
- Images: `public/images/`
