import type { APIRoute } from 'astro';
import Stripe from 'stripe';

export const prerender = false;

const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key);
};

// Core products
const hosting = {
  name: 'Custom App - Hosting/Management',
  priceId: 'price_1Sxv3uBUNvYd8nY7SUUyUsj9',
  amount: 5000,
};

const unlimitedEdits = {
  name: 'Custom App - Unlimited Edits',
  priceId: 'price_1SxuzTBUNvYd8nY780UwbIXu',
  amount: 30000,
};

// Add-on products (all monthly recurring)
const addons: Record<string, {
  name: string;
  priceId: string;
  amount: number;
  supportsQuantity: boolean;
}> = {
  'client-portal': {
    name: 'Client Portal',
    priceId: 'price_1T0fNIBUNvYd8nY7fK03wsFS',
    amount: 2500,
    supportsQuantity: false,
  },
  'ai-automation': {
    name: 'AI Automation',
    priceId: 'price_1T0fNkBUNvYd8nY7vAv2r5lV',
    amount: 2500,
    supportsQuantity: false,
  },
  'video-generation': {
    name: 'Video Generation',
    priceId: 'price_1T0fOFBUNvYd8nY74f3K0ahO',
    amount: 5000,
    supportsQuantity: false,
  },
  'image-generation': {
    name: 'Image Generation',
    priceId: 'price_1T0fP1BUNvYd8nY79yfitxOU',
    amount: 2500,
    supportsQuantity: false,
  },
  'voice-agent': {
    name: 'Voice Agent',
    priceId: 'price_1T0fPIBUNvYd8nY7L1JwR0HG',
    amount: 5000,
    supportsQuantity: false,
  },
  'api-integration': {
    name: 'External API Integration',
    priceId: 'price_1T0fQ1BUNvYd8nY7T6NgcYVJ',
    amount: 2500,
    supportsQuantity: true,
  },
};

interface AddonSelection {
  id: string;
  quantity?: number;
}

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const stripe = getStripe();

    const body = await request.json();
    const { plan, includeUnlimitedEdits, selectedAddons, customerEmail } = body as {
      plan: string;
      includeUnlimitedEdits?: boolean;
      selectedAddons: AddonSelection[];
      customerEmail?: string;
    };

    // Validate — hosting is always required
    if (plan !== 'hosting') {
      return new Response(
        JSON.stringify({ error: 'Invalid plan. Hosting is the required base plan.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build line items: hosting base is always first
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: hosting.priceId,
        quantity: 1,
      },
    ];

    // Add Unlimited Edits if selected
    const hasEdits = includeUnlimitedEdits === true;
    if (hasEdits) {
      lineItems.push({
        price: unlimitedEdits.priceId,
        quantity: 1,
      });
    }

    // Track selected addon names for metadata
    const addonNames: string[] = [];

    // Add selected add-ons
    if (selectedAddons && Array.isArray(selectedAddons)) {
      for (const selection of selectedAddons) {
        const addon = addons[selection.id];
        if (!addon) {
          return new Response(
            JSON.stringify({ error: `Invalid add-on: ${selection.id}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const quantity = addon.supportsQuantity
          ? Math.max(1, Math.min(selection.quantity || 1, 20))
          : 1;

        lineItems.push({
          price: addon.priceId,
          quantity,
        });

        const qtyLabel = quantity > 1 ? ` (x${quantity})` : '';
        addonNames.push(`${addon.name}${qtyLabel}`);
      }
    }

    // Build plan name for metadata
    const planLabel = hasEdits
      ? 'Hosting + Unlimited Edits'
      : 'Hosting';

    const successUrl = new URL('/checkout/subscription-success', url.origin);
    successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

    const cancelUrl = new URL('/custom-software', url.origin);
    cancelUrl.searchParams.set('cancelled', 'true');

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        plan: 'hosting',
        plan_name: planLabel,
        includes_unlimited_edits: String(hasEdits),
        addons: addonNames.join(', ') || 'none',
        addon_count: String(addonNames.length),
      },
      subscription_data: {
        metadata: {
          plan: 'hosting',
          plan_name: planLabel,
          includes_unlimited_edits: String(hasEdits),
          addons: addonNames.join(', ') || 'none',
        },
      },
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    };

    // Pre-fill email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Subscription checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create subscription checkout';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
