// @ts-check
/**
 * GA4 tracking contract for buildwithjeremy.com (property 533770082).
 *
 * The complete list of GA4 events this site sends. Each event has a type:
 *   click (default)  tagged element, e.g.
 *                    <a href="/contact/" data-track="service_interest" data-track-tier="retainer">
 *                    sent by the delegated listener in src/components/GoogleAnalytics.astro
 *   programmatic     sent from code in `source`; `marker` is the attribute the code
 *                    finds its element by, e.g. data-track-form="newsletter"
 *   embed            sent from a third-party embed's postMessage; `marker` tags the container
 *   auto             rule-based on every page; `codeMarker` must be in the GA script
 * scripts/check-tracking.mjs (postbuild) fails the build if the built html or src/
 * drifts from this file. See docs/tracking.md.
 *
 * Plain .mjs (not .ts) so the postbuild check can import it with bare Node.
 */

/** Service tiers currently offered. Keep in sync with the cards on / and /services/. */
export const SERVICE_TIERS = /** @type {const} */ (['retainer', 'sprint', 'ai-audit']);

/**
 * @typedef {{ values?: readonly string[], required?: boolean, requiredWhen?: Record<string, string | string[]>, auto?: boolean, description?: string }} ParamSpec
 * @typedef {{ page: string, min?: number, each?: string, where?: Record<string, string>, except?: string[] }} Expectation
 *   page: route ('/services/') or prefix glob ('/vs/*'). each: require >= min per allowed value of that param. except: routes a glob skips.
 *   page '*' means every built page.
 * @typedef {{ name: string, type?: 'click' | 'programmatic' | 'embed' | 'auto', on?: 'click' | 'toggle', description: string, params: Record<string, ParamSpec>, expect?: Expectation[], source?: string | string[], helper?: string, marker?: string, codeMarker?: string, rule?: string }} TrackedEvent
 */

export const TRACKING = {
  /** Custom scroll_depth event; GA4 enhanced measurement already sends 90%. */
  scrollDepth: {
    event: 'scroll_depth',
    thresholds: [25, 50, 75],
    pages: ['/', '/services/'],
  },

  /** @type {TrackedEvent[]} */
  events: [
    {
      name: 'service_interest',
      description: 'Click on a service tier card link or CTA.',
      params: {
        tier: { values: SERVICE_TIERS, required: true },
        source_page: { auto: true, description: 'location.pathname, added by the listener' },
      },
      expect: [
        { page: '/', each: 'tier', min: 1 },
        { page: '/services/', each: 'tier', min: 1 },
      ],
    },
    {
      name: 'cta_click',
      description: 'Click on a primary CTA (the "Work With Me" header button and the "Book a Free Systems Audit" buttons).',
      params: {
        event_category: { auto: true, description: "'engagement'" },
        event_label: { auto: true, description: 'the element text' },
        cta_location: { auto: true, description: "closest [data-section] value, else 'unknown'" },
      },
      expect: [
        { page: '*', min: 2 }, // Header: desktop + mobile "Work With Me"
        { page: '/', min: 4 }, // + Hero primary CTA + final CTA
        { page: '/about/', min: 4 },
        { page: '/services/', min: 6 }, // + 3 service cards + final CTA
        { page: '/404', min: 3 },
        { page: '/strategic-operations-partner/', min: 3 },
        { page: '/operations-consulting/', min: 3 },
        { page: '/ai-automation-consulting/', min: 3 },
      ],
    },
    {
      name: 'faq_open',
      on: 'toggle', // tagged like a click event, but sent by the toggle listener, not on click
      description: 'An FAQ <details> item opened (fires on open only, via the toggle event).',
      params: {
        event_category: { auto: true, description: "'engagement'" },
        faq_question: { auto: true, description: 'the <summary> text' },
        page_path: { auto: true, description: 'location.pathname' },
      },
      expect: [
        '/', '/services/', '/contact/', '/custom-software/', '/strategic-operations-partner/',
        '/operations-consulting/', '/ai-automation-consulting/', '/ai-employee/general/',
        '/ai-employee/marketing-agencies/', '/ai-employee/social-media-agencies/',
        '/ai-employee/recruiting-agencies/', '/ai-employee/seo-agencies/',
        // Blog posts render an FAQ only when their frontmatter declares faqs.
        '/blog/build-vs-buy-software/', '/blog/hire-a-consultant-buy-software-or-build-custom/',
      ].map((page) => ({ page, min: 1 })),
    },
    {
      name: 'sign_up',
      type: 'programmatic',
      description: 'Newsletter form submitted.',
      params: {
        event_category: { auto: true, description: "'conversion'" },
        method: { auto: true, description: "'newsletter'" },
      },
      source: 'src/components/GoogleAnalytics.astro',
      marker: 'data-track-form="newsletter"',
      expect: [{ page: '/' }, { page: '/about/' }, { page: '/resources/' }],
    },
    {
      name: 'qualified_booking_start',
      type: 'programmatic',
      description: 'Step 1 (fit check) of the /contact booking form submitted.',
      params: {
        event_category: { auto: true, description: "'booking'" },
        role: { auto: true },
        revenue_band: { auto: true },
        timeline: { auto: true },
      },
      source: 'src/pages/contact.astro',
      marker: 'data-track-form="qualify"',
      expect: [{ page: '/contact/' }],
    },
    {
      name: 'begin_checkout',
      type: 'programmatic',
      description: 'Checkout button on /custom-software/ clicked (before the Stripe redirect).',
      params: {
        event_category: { auto: true, description: "'ecommerce'" },
        value: { auto: true, description: 'the displayed total' },
        currency: { auto: true, description: "'USD'" },
      },
      source: 'src/pages/custom-software/index.astro',
      marker: 'data-track-source="checkout"',
      expect: [{ page: '/custom-software/' }],
    },
    {
      name: 'purchase',
      type: 'programmatic',
      description: 'Stripe success page loaded. Sent from both success pages (event_label ai_employee or custom_software).',
      params: {
        event_category: { auto: true, description: "'conversion'" },
        event_label: { auto: true },
      },
      source: ['src/pages/checkout/success.astro', 'src/pages/checkout/subscription-success.astro'],
      expect: [{ page: '/checkout/success/' }, { page: '/checkout/subscription-success/' }],
    },
    {
      name: 'calendly_viewed',
      type: 'embed',
      description: 'Calendly embed loaded an event type.',
      params: { event_category: { auto: true, description: "'booking'" } },
      marker: 'data-track-embed="calendly"',
      codeMarker: "'calendly.event_type_viewed'",
      expect: [{ page: '/contact/' }],
    },
    {
      name: 'calendly_date_selected',
      type: 'embed',
      description: 'Date and time picked in the Calendly embed.',
      params: { event_category: { auto: true, description: "'booking'" } },
      marker: 'data-track-embed="calendly"',
      codeMarker: "'calendly.date_and_time_selected'",
      expect: [{ page: '/contact/' }],
    },
    {
      name: 'generate_lead',
      type: 'embed',
      description: 'Calendly booking completed. The only key event.',
      params: {
        event_category: { auto: true, description: "'conversion'" },
        event_label: { auto: true, description: "'calendly_booking'" },
      },
      marker: 'data-track-embed="calendly"',
      codeMarker: "'calendly.event_scheduled'",
      expect: [{ page: '/contact/' }],
    },
    {
      name: 'outbound_click',
      type: 'auto',
      description: 'Click on any link to LinkedIn, X, YouTube or Upwork.',
      rule: 'href contains linkedin.com, x.com, youtube.com or upwork.com',
      params: {
        event_category: { auto: true, description: "'engagement'" },
        link_url: { auto: true },
        link_text: { auto: true },
      },
      codeMarker: "href.includes('upwork.com')",
    },
    {
      name: 'contact',
      type: 'auto',
      description: 'Click on any mailto: link.',
      rule: "href starts with 'mailto:'",
      params: {
        event_category: { auto: true, description: "'engagement'" },
        method: { auto: true, description: "'email'" },
      },
      codeMarker: "href.startsWith('mailto:')",
    },
  ],
};
