/**
 * Central pricing configuration for Custom Software plans.
 *
 * TO CHANGE PRICES FOR NEW CUSTOMERS:
 * 1. Create a new Price in Stripe Dashboard on the same Product
 * 2. Update the `priceId` and `amount` below
 * 3. Deploy
 *
 * Existing subscribers stay on their current price automatically (Stripe
 * handles this — they reference the old Price ID on their subscription).
 */

// ─── Core Products ───

export const hosting = {
  productId: 'prod_TvmdpdOqPNTm8f',
  priceId: 'price_1Sxv3uBUNvYd8nY7SUUyUsj9',
  name: 'Custom App - Hosting/Management',
  amount: 5000, // cents → $50/mo
  label: 'Core App Hosting',
  description: 'Everything you need to keep your system running and supported.',
} as const;

export const unlimitedEdits = {
  productId: 'prod_TvmYQSYH8lnO2f',
  priceId: 'price_1SxuzTBUNvYd8nY780UwbIXu',
  name: 'Custom App - Unlimited Edits',
  amount: 30000, // cents → $300/mo
  label: 'Unlimited Edits',
  description: 'Ongoing feature requests, tweaks, and improvements — no scoping, no quoting.',
} as const;

// ─── Add-ons ───

export interface Addon {
  productId: string;
  priceId: string;
  name: string;
  amount: number; // cents
  label: string;
  description: string;
  supportsQuantity: boolean;
}

export const addons: Record<string, Addon> = {
  'client-portal': {
    productId: 'prod_TyccJwxFG3QMqT',
    priceId: 'price_1T0fNIBUNvYd8nY7fK03wsFS',
    name: 'Client Portal',
    amount: 2500, // $25/mo
    label: 'Client Portal',
    description: 'Secure login, dashboard, and client-specific views.',
    supportsQuantity: false,
  },
  'ai-automation': {
    productId: 'prod_Tycd6rl7Hqffr9',
    priceId: 'price_1T0fNkBUNvYd8nY7vAv2r5lV',
    name: 'AI Automation',
    amount: 2500, // $25/mo
    label: 'AI Automation',
    description: 'AI-powered workflows, webhooks, and task automation.',
    supportsQuantity: false,
  },
  'video-generation': {
    productId: 'prod_Tycd2JKoH8YnJE',
    priceId: 'price_1T0fOFBUNvYd8nY74f3K0ahO',
    name: 'Video Generation',
    amount: 5000, // $50/mo
    label: 'Video Generation',
    description: 'AI video creation. Usage fees may apply.',
    supportsQuantity: false,
  },
  'image-generation': {
    productId: 'prod_TycexX1Nj0dcwc',
    priceId: 'price_1T0fP1BUNvYd8nY79yfitxOU',
    name: 'Image Generation',
    amount: 2500, // $25/mo
    label: 'Image Generation',
    description: 'AI image creation. Usage fees may apply.',
    supportsQuantity: false,
  },
  'voice-agent': {
    productId: 'prod_TycemVuFHUmjTz',
    priceId: 'price_1T0fPIBUNvYd8nY7L1JwR0HG',
    name: 'Voice Agent',
    amount: 5000, // $50/mo
    label: 'Voice Agent',
    description: 'AI voice assistant. Usage fees may apply.',
    supportsQuantity: false,
  },
  'api-integration': {
    productId: 'prod_TycfrERGbbuL6Q',
    priceId: 'price_1T0fQ1BUNvYd8nY7T6NgcYVJ',
    name: 'External API Integration',
    amount: 2500, // $25/mo each
    label: 'API Integration',
    description: 'Connect to external tools (QuickBooks, Stripe, Calendly, etc.).',
    supportsQuantity: true,
  },
};

// ─── Helpers ───

/** Format cents to display string, e.g. 5000 → "$50" */
export const formatPrice = (cents: number): string =>
  `$${(cents / 100).toLocaleString()}`;

/** Format cents to display with /mo suffix, e.g. 5000 → "$50/mo" */
export const formatMonthly = (cents: number): string =>
  `${formatPrice(cents)}/mo`;

/** Format addon price for display, e.g. 2500 → "+$25/mo" */
export const formatAddonPrice = (addon: Addon): string => {
  const base = `+${formatPrice(addon.amount)}/mo`;
  return addon.supportsQuantity ? `${base} each` : base;
};

/**
 * Client-safe pricing data (no Stripe IDs) for embedding in the frontend.
 * This is what gets serialized into the page for the client-side JS.
 */
export const getClientPricing = () => ({
  hosting: { amount: hosting.amount, label: hosting.label },
  unlimitedEdits: { amount: unlimitedEdits.amount, label: unlimitedEdits.label },
  addons: Object.fromEntries(
    Object.entries(addons).map(([key, addon]) => [
      key,
      { amount: addon.amount, label: addon.label, supportsQuantity: addon.supportsQuantity },
    ])
  ),
});
