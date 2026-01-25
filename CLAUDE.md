# Build with Jeremy - Project Guidelines

## About This Project
This is the website for "Build with Jeremy" - a consulting business helping solopreneurs and small teams streamline, automate, and scale their operations.

**Owner**: Jeremy Pittman
**Background**: 12 years at Google, now full-time consultant
**Target Audience**: Solopreneurs, small teams (1-10 people), service-based businesses (consultants, agencies, coaches, creative professionals)

---

## Tech Stack
- **Framework**: Astro 5.x (static site generation)
- **Styling**: Tailwind CSS 4 with custom CSS variables
- **CMS**: Keystatic (git-based, at `/keystatic` route)
- **Hosting**: Vercel
- **Newsletter**: MailerLite
- **Fonts**: Google Sans Flex (primary), Inter (fallback)

---

## Brand Colors

### Primary Palette
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Brand Purple** | #5565f1 | `--color-brand` | Primary brand color, links, navigation active states, general accents |
| **Primary Blue** | #122fed | `--color-primary` | Authority/trust elements, "My Journey" headings, "Full Partnership" service |
| **Accent Green** | #4dfe43 | `--color-accent` | CTAs, highlights, success indicators, stats numbers, checkmarks, "Quick Start" service |

### Color Usage Rules
1. **Section-level consistency**: All icons/elements within a section should use the same color
2. **Accent Green for action/success**: Stats numbers, checkmarks, positive outcomes, highlights
3. **Primary Blue for authority**: Experience headings, trust indicators
4. **Brand Purple for identity**: Links, navigation, general UI accents
5. **Service card differentiation**: Green badge for "Quick Start", Blue badge for "Full Partnership"

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
- **Approachable expert**: Knowledgeable but not intimidating
- **Empathetic**: Understands small business pain points firsthand
- **Action-oriented**: Focus on results and getting things done
- **No jargon**: Simple, clear language

### Key Messages
- "Build a business that runs without you"
- "Freedom, not chaos"
- "Simple systems, not complicated software"
- "Partnership, not projects"

### Phrases to Use
- "Streamline, automate, and scale"
- "Reclaim your time"
- "Stop putting out fires"
- "Systems that run on autopilot"
- "Quick wins first"

### Phrases to Avoid
- Overly corporate language
- Complex technical jargon
- Promises of specific timeframes (no "in just 2 weeks!")
- Pushy sales language

---

## Component Patterns

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

---

## Page Structure

### Standard Sections
1. **Hero** - Headline, subheadline, CTA, optional image
2. **Stats Bar** - Dark background (`theme-bg-inverse`), green numbers
3. **Problem Section** - Address pain points
4. **Solution/About Preview** - Introduce Jeremy
5. **Testimonials** - 3-column grid with star ratings
6. **Services Preview** - Card-based, color-coded badges
7. **FAQ** - Accordion style with `<details>` elements
8. **CTA Section** - Final call to action
9. **Newsletter** - MailerLite integration

### Theme Toggle
- Located in footer only (not header)
- Small and unobtrusive
- Uses JavaScript-based icon switching

---

## Image Guidelines
- Use `.webp` format for photos
- Hero images: `rounded-2xl shadow-2xl`
- Headshots: `rounded-2xl`
- Always include descriptive `alt` text

---

## SEO Defaults
- Title format: `{Page Title} | Build with Jeremy`
- Default description: "I help solopreneurs and small teams streamline, automate, and scale so they can grow without drowning in the chaos of day-to-day operations."
- Include Open Graph and Twitter meta tags

---

## File Locations
- Styles: `src/styles/global.css`
- Layout: `src/layouts/Layout.astro`
- Components: `src/components/`
- Pages: `src/pages/`
- Images: `public/images/`
