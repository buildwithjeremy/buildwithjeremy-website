# GA4 tracking

GA4 property 533770082 (buildwithjeremy.com). This doc covers the shared mechanism used by both
this site and buildmysystem-website, plus this site's events. BMS lists its own events in its
`docs/tracking.md`.

## How it works

- **Contract:** `src/config/tracking.mjs` is the complete list of GA4 events the site sends, with
  their params and the pages where each must be able to fire. It also lists the scroll-depth
  pages. It is plain `.mjs` so the build check can import it without TypeScript. If an event is
  not in the contract, the site must not send it.
- **Runtime:** `src/components/GoogleAnalytics.astro` holds one delegated click listener, one
  capture-phase `toggle` listener (FAQ), one `submit` listener (newsletter), the Calendly
  `message` listener, and the scroll-depth handler. All are bound on `document`/`window` from the
  head, so they work before the DOM exists and for elements added later. Neither site uses
  Astro view transitions; if one is added, re-run the scroll handler on `astro:page-load`.
- **Check:** `scripts/check-tracking.mjs` runs as `postbuild` and as `npm run check:tracking`. It
  reads the contract, the built HTML in `dist/`, and `src/`, and fails the build when a page
  can no longer produce an event it should, a tag or param is not in the contract, or any
  `gtag('event', '<name>')` in `src/` names an event the contract does not list. Every message
  names the page or file, the event, and the fix. The script is byte-identical in both repos
  (listed in `scripts/check-shared-files.mjs`, run `npm run check:shared`).
- **Client-rendered elements:** the page checks read `dist/` only. Every tagged element today is
  server-rendered. If you ever render one in the browser, render it server-side instead or
  extend the check, and note it here.

## The four event types

Each contract entry has a `type` (default `click`).

**click**: an element opts in with attributes. `data-track` names the event (a space-separated
list when one element sends two, e.g. `data-track="offer_interest cta_click"`); every
`data-track-<param>` attribute becomes a param (dashes become underscores) and the listener adds
`source_page`. `cta_click` keeps its original params (`event_category`, `event_label` = element
text, `cta_location`) and `faq_open` is sent by the toggle listener on open only (`on: 'toggle'`).

```html
<a href="/contact/" data-track="service_interest cta_click" data-track-tier="retainer">...</a>
<details data-track="faq_open" class="...">...</details>
```

How to: tag the element, add the event and its allowed param values to the contract, add an
`expect` entry (`page`, `min`, optional `where`/`each`; `page: '*'` means every page). If a
shared component renders the element, tag it once in the component.

**programmatic**: sent from code (form submit, button handler, page load). The contract names the
`source` file and, when the code hangs off an element, a `marker` attribute such as
`data-track-form="newsletter"` (forms) or `data-track-source="checkout"` (anything else). The
code must find its element with that attribute selector, not an id or class:

```js
const form = document.querySelector('[data-track-form="qualify"]');
```

The check asserts the marker is on each `expect` page, the source file still names the event,
and the source file contains the `[marker]` selector. How to: add the marker attribute, look the
element up by it, add the entry with `source`, `marker`, `expect`. If the file sends through a
wrapper (e.g. `tr('film_view')`), add `helper: 'tr'` so the source scan reads its calls.

**embed**: sent from a third-party embed's `postMessage` (Calendly). Tag the container with
`data-track-embed="calendly"`; the entry lists the pages and a `codeMarker` (the postMessage
event string the handler matches). The check asserts the container is on those pages and the
code marker is in the built GA script.

**auto**: rule-based on every page (any outbound social link, any `mailto:`). This is the right
design for generic links, so these are not tagged. The entry describes the `rule` and a
`codeMarker` (a line of the rule, e.g. `href.startsWith('mailto:')`); the check asserts the
marker is in the built GA script. If `PUBLIC_GA4_ID` is unset the build has no GA script and the
check reads `GoogleAnalytics.astro` instead.

The source scan covers `.astro`, `.ts`, `.js` and similar files under `src/`. A `gtag` call with
a computed event name fails unless it is in `GoogleAnalytics.astro` or a file declared with a
`helper`.

## Events on buildwithjeremy.com

| Event | Type | Params | Where it must be able to fire |
|---|---|---|---|
| `service_interest` | click | `tier`: `retainer`, `sprint`, `ai-audit`; `source_page` | `/` and `/services/`: 1+ per tier |
| `cta_click` | click | `event_category`, `event_label`, `cta_location` | every page (Header "Work With Me", 2); more on `/`, `/about/`, `/services/`, `/404`, and the three consulting pages |
| `faq_open` | click (toggle) | `event_category`, `faq_question`, `page_path` | every page that renders an FAQ |
| `scroll_depth` | scroll | `percent`: 25, 50, 75; `source_page` | `/` and `/services/` (GA4 already sends 90) |
| `sign_up` | programmatic | `event_category`, `method: newsletter` | `form[data-track-form="newsletter"]` on `/`, `/about/`, `/resources/` |
| `qualified_booking_start` | programmatic | `event_category`, `role`, `revenue_band`, `timeline` | `data-track-form="qualify"` on `/contact/` |
| `begin_checkout` | programmatic | `event_category`, `value`, `currency` | `data-track-source="checkout"` on `/custom-software/` |
| `purchase` | programmatic | `event_category`, `event_label` | page load of `/checkout/success/` and `/checkout/subscription-success/` |
| `calendly_viewed`, `calendly_date_selected` | embed | `event_category` | `data-track-embed="calendly"` on `/contact/` |
| `generate_lead` | embed | `event_category`, `event_label: calendly_booking` | same; the only key event |
| `outbound_click` | auto | `event_category`, `link_url`, `link_text` | any link to LinkedIn, X, YouTube, Upwork |
| `contact` | auto | `event_category`, `method: email` | any `mailto:` link |

Tagged `cta_click` elements: the Header "Work With Me" (desktop and mobile), the `Hero` primary
CTA, and each "Book a Free Systems Audit" button (the three `/services/` cards also send
`service_interest`). There are no per-tier detail pages today; if one is added, tag its main CTA
with the same `service_interest` attributes and add an expectation.

## When a page is restructured

Rewriting or replacing a page (for example the services page) is safe as long as the build is
green. If the check fails:

- **You removed or renamed an element on purpose:** update `src/config/tracking.mjs` (the tier
  list, the event's `expect` pages or `min`, or `scrollDepth.pages`).
- **You did not mean to:** put the `data-track` or marker attributes back on the new element.
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
   `service_interest`, `offer_interest`, or `cta_click` as key events.
3. **Custom dimensions (event scope):** `tier`, `action`, `percent`, `source_page`, so the params
   show up in reports.
4. **Search Console link:** Admin > Product links > Search Console links > link the matching
   Search Console property.
