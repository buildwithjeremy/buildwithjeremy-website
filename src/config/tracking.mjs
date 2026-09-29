// @ts-check
/**
 * GA4 tracking contract for buildwithjeremy.com (property 533770082).
 *
 * The single source of truth for custom GA4 events sent from markup. Elements
 * opt in with data attributes, e.g.
 *   <a href="/contact/" data-track="service_interest" data-track-tier="retainer">
 * and the one delegated listener in src/components/GoogleAnalytics.astro sends
 * gtag('event', name, params). scripts/check-tracking.mjs (postbuild) fails the
 * build if the built html drifts from this file. See docs/tracking.md.
 *
 * Plain .mjs (not .ts) so the postbuild check can import it with bare Node.
 */

/** Service tiers currently offered. Keep in sync with the cards on / and /services/. */
export const SERVICE_TIERS = /** @type {const} */ (['retainer', 'sprint', 'ai-audit']);

/**
 * @typedef {{ values?: readonly string[], required?: boolean, requiredWhen?: Record<string, string | string[]>, auto?: boolean, description?: string }} ParamSpec
 * @typedef {{ page: string, min?: number, each?: string, where?: Record<string, string>, except?: string[] }} Expectation
 *   page: route ('/services/') or prefix glob ('/vs/*'). each: require >= min per allowed value of that param. except: routes a glob skips.
 * @typedef {{ name: string, description: string, params: Record<string, ParamSpec>, expect?: Expectation[] }} TrackedEvent
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
  ],
};
