# GA4 tracking

GA4 property 533770082 (buildwithjeremy.com). This doc covers the shared mechanism used by both
this site and buildmysystem-website, plus this site's events. BMS lists its own events in its
`docs/tracking.md`.

## How it works

- **Contract:** `src/config/tracking.mjs` lists every custom event sent from markup, its params,
  the allowed values, and the pages where tagged elements are expected. It also lists the
  scroll-depth pages. It is plain `.mjs` so the build check can import it without TypeScript.
- **Markup:** an element opts in with data attributes. `data-track` names the event; every
  `data-track-<param>` attribute becomes a param (dashes become underscores).

  ```html
  <a href="/contact/" data-track="service_interest" data-track-tier="retainer">...</a>
  ```

- **Runtime:** `src/components/GoogleAnalytics.astro` has one delegated click listener on
  `document`. On click it finds the closest `[data-track]` element and sends
  `gtag('event', name, params)`, adding `source_page` (the path) automatically. No per-page
  scripts, no selectors on ids or classes. It is bound from the head, so it works before the DOM
  exists and for elements added later. Neither site uses Astro view transitions; if one is added,
  the click listener keeps working (it lives on `document`), but the scroll handler and the
  legacy FAQ binding must be re-run on `astro:page-load`.
- **Check:** `scripts/check-tracking.mjs` runs as `postbuild` and as `npm run check:tracking`. It
  parses the built HTML in `dist/` and fails the build when:
  1. a page listed in the contract has fewer tagged elements than expected,
  2. a `data-track` value is not an event in the contract,
  3. a `data-track-*` param is undeclared, has a value outside the allowed list, or a required
     param is missing,
  4. a scroll-depth page in the contract was not built.

  Every message names the page, the event, and the fix. The script is byte-identical in both
  repos (listed in `scripts/check-shared-files.mjs`, run `npm run check:shared`).
- **Client-rendered elements:** the check reads `dist/` only. Every tagged element today is
  server-rendered, including the BMS quote-builder tier buttons. If you ever render a tagged
  element in the browser, render it server-side instead or extend the check with a source-file
  check, and note it here.

## Events on buildwithjeremy.com

| Event | Params | Where it is expected |
|---|---|---|
| `service_interest` | `tier`: `retainer`, `sprint`, `ai-audit`; `source_page` (auto) | `/` and `/services/`: at least 1 element per tier |
| `scroll_depth` | `percent`: 25, 50, 75; `source_page` | `/` and `/services/` only (GA4 enhanced measurement already sends 90) |

Tagged elements:

- `/`: the three "Explore ..." links in the "Ways to work together" service cards.
- `/services/`: the CTA button on each service card (`tier` comes from the `tier` field of the
  `services` array in `src/pages/services/index.astro`).

There are no per-tier detail pages today (the `services` content collection is empty). If one is
added, tag its main CTA with the same `service_interest` attributes and add an expectation.

### Legacy events (kept as is)

These predate the contract and still work. They match on link text, href, or element type, so a
copy change can silently stop them. Migrate to `data-track` when you next touch them.

- `cta_click`: any link or button whose text contains "Systems Audit" or "Work With Me".
- `outbound_click`: links to LinkedIn, X, YouTube, Upwork.
- `contact`: `mailto:` links.
- `faq_open`: any `<details>` opened.
- `calendly_viewed`, `calendly_date_selected`, `generate_lead`: Calendly postMessage events.
  `generate_lead` is the only key event.
- `sign_up` (newsletter): submit of `form[data-newsletter-form]`.

## Tag a new element

1. Add `data-track="<event>"` and one `data-track-<param>="<value>"` per param to the link or
   button. For a new param value, add it to the allowed list in `src/config/tracking.mjs`.
2. For a new event, add it to `TRACKING.events` with its params and an `expect` entry for the
   pages it must appear on. Then register it as a custom dimension in GA4 if you want to report
   on its params.
3. `npm run build`. The check tells you what is missing.

## When a page is restructured

Rewriting or replacing a page (for example the services page) is safe as long as the build is
green. If the check fails:

- **You removed or renamed a card on purpose:** update `src/config/tracking.mjs` (the tier list,
  the event's `expect` pages, or `scrollDepth.pages`).
- **You did not mean to:** put the `data-track` attributes back on the new element.
- **A page moved:** update the route in the contract. Routes use the site's trailing-slash
  style, but the check normalizes either way.

## Internal traffic

Open these once per browser and device you use (any page works):

- Mark this browser as internal: `https://buildwithjeremy.com/?internal=1` and
  `https://buildmysystem.co/?internal=1` (localStorage is per domain, so do both).
- Undo it: the same URLs with `?internal=0`.

When the flag is set, `GoogleAnalytics.astro` sends `traffic_type: 'internal'` in the gtag config
call. Nothing is stripped from the URL. Private windows and cleared storage lose the flag.

## Admin steps Jeremy does once

Not done by code. In GA4 Admin, for each property:

1. **Data filters > Internal traffic:** set the filter to **Active** (start in Testing and confirm
   in DebugView if you want to be careful). Until it is Active, internal hits are only labeled.
2. **Key events:** keep `generate_lead` as the only key event; do not mark `scroll_depth`,
   `service_interest`, or `offer_interest` as key events.
3. **Custom dimensions (event scope):** `tier`, `action`, `percent`, `source_page`, so the params
   show up in reports.
4. **Search Console link:** Admin > Product links > Search Console links > link the matching
   Search Console property.
