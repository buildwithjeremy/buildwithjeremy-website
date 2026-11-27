import type Stripe from 'stripe';

// The Stripe API version every route pins. Typed as the installed SDK's
// version, so a stripe bump that moves it fails the type-check here only.
export const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-11-18.endive';
