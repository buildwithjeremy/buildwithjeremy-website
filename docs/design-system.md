# Design system: Build with Jeremy + Build My System

One design system, two sites. This is the only doc for it; both sites' CLAUDE.md files point here instead of repeating it. Brand voice, copy, pricing and page structure are per site and live in each CLAUDE.md.

## What is shared, and how

`src/styles/tokens.css` is byte-identical in `buildwithjeremy-website` (canonical) and `buildmysystem-website` (vendored copy). It holds:

- the palette (`:root` light, `.dark` dark) and layout variables
- the dark-mode mechanism: `@custom-variant dark` so Tailwind `dark:` follows the `.dark` class the theme toggle sets, not the OS
- the brand `@theme` block (colors, fonts)
- base, prose, buttons, card, theme-aware and inverse-section utilities, brand color utilities, gradient text, focus states, stat/testimonial/FAQ styles, `fadeInUp`, `.theme-toggle`, and a global reduced-motion guard

Each site's `src/styles/global.css` is `@import "tailwindcss"`, then `@import "./tokens.css"`, then site-only rules (BMS: the hero animation stack).

**The rule:** edit `tokens.css` in buildwithjeremy-website only. Copy it to buildmysystem-website in the same sitting and ship both. `npm run check:shared` in either repo compares the shared files against the sibling clone at `../<sibling>` (or `SHARED_SIBLING_DIR`) and warns on drift. It never fails a build.

Not shared, on purpose: `pricing.ts`, copy and nav, brand voice, `schema.ts` entity facts, `llms.txt`, Keystatic/MDX (BWJ blog only), the BMS hero animation stack, `trailingSlash` (BWJ `always`, BMS `never`, each matching what Google indexed), GA ids. Components such as `ThemeToggle`, `QuickAnswer` and `BrandHandoff` exist in both repos with brand-specific copy; keep their markup on the shared classes below so they render the same way. Decision record: BWJ-Ops `website-design-system-sharing-2026-09-28.md`.

## Colors

| Name | Hex | Variable | Use |
|---|---|---|---|
| Brand Purple | #5565f1 | `--color-brand` | Primary brand color, links, nav active states, general accents |
| Primary Blue | #122fed | `--color-primary` | Authority and trust elements, headings |
| Accent Green | #4dfe43 | `--color-accent` | CTAs, highlights, success, stat numbers, checkmarks |

Rules:
1. Keep all icons and accents within one section the same color.
2. Accent Green for action and success. Primary Blue for authority. Brand Purple for identity.
3. Never hardcode Tailwind grays (`text-gray-900`, `bg-gray-50`) or raw `dark:` color pairs for surfaces and text. Use the theme classes, which already switch with the toggle.

Classes:
- Brand: `text-brand` / `bg-brand`, `text-primary-color` / `bg-primary-color`, `text-primary-light`, `text-accent` / `bg-accent`, `text-accent-dark` (icons on light backgrounds), `text-gradient`, `text-gradient-accent`
- Surfaces and text: `theme-bg-primary|secondary|tertiary`, `theme-text-primary|secondary|tertiary|muted`
- Inverse sections (dark in both themes, e.g. footers and dark CTA bands): `theme-bg-inverse`, `theme-text-inverse`, `theme-text-inverse-muted`, `theme-text-inverse-faint`, `theme-border-inverse`, `theme-bg-inverse-card`, `btn-outline-inverse`. Headings inside `theme-bg-inverse` pick up `--text-inverse` automatically.
- Borders: `style="border-color: var(--border-color);"` or the `card` class.

## Typography

`font-family: 'Google Sans Flex', 'Inter', system-ui, sans-serif;` (loaded in each Layout). Headings are `font-bold`.

- H1: `text-4xl sm:text-5xl lg:text-6xl`
- H2: `text-3xl md:text-4xl`
- H3: `text-xl` or `text-lg`
- Stat values: `text-accent`, `text-3xl md:text-5xl font-bold`

## Primitives

- Buttons: `.btn` plus one of `.btn-primary` (purple, main CTA), `.btn-secondary` (blue), `.btn-accent` (green, use sparingly), `.btn-outline` (outlined purple), `.btn-outline-inverse` (on inverse sections).
- Cards: `.card`, or `rounded-xl` / `rounded-2xl` with a `--border-color` border and a subtle hover (`hover:border-accent`).
- Icons in sections: `bg-{color}/10` backgrounds, `h-12 w-12` small, `h-16 w-16` large.
- Images: `.webp`, hero images `rounded-2xl shadow-2xl`, descriptive `alt` always.

## Dark mode

The theme toggle (footer only, small) sets or removes `.dark` on `<html>`, defaulting to the OS preference until the visitor chooses. All variables flip under `.dark`; inverse sections stay dark. Tailwind `dark:` utilities follow the same class because of the `@custom-variant` in tokens.css.
