import type { APIRoute } from 'astro';
import Stripe from 'stripe';

// Disable prerendering for this API route (server-side only)
export const prerender = false;

// Use process.env for runtime env vars (import.meta.env gets inlined at build time)
const getStripe = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key);
};

// Price IDs - live prices for production, test prices for development
const products: Record<string, { name: string; livePriceId: string; testPriceId: string; price: number }> = {
  starter: {
    name: 'AI Employee Starter',
    livePriceId: 'price_1SwPuNBUNvYd8nY7YasGaThB',
    testPriceId: 'price_1SvwiJBUNvYd8nY7UdWUHfZa',
    price: 2997,
  },
  pro: {
    name: 'AI Employee Pro',
    livePriceId: 'price_1SwPuOBUNvYd8nY7woIg0cmQ',
    testPriceId: 'price_1SvwiOBUNvYd8nY7bFFUyiX4',
    price: 4497,
  },
  agency: {
    name: 'AI Employee Agency',
    livePriceId: 'price_1SwPuOBUNvYd8nY70CQPxwlE',
    testPriceId: 'price_1SvwiPBUNvYd8nY7IKvBIXPD',
    price: 6997,
  },
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const stripe = getStripe();
    const isLive = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live');

    const body = await request.json();
    const { tier, niche } = body;

    if (!tier || !products[tier]) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const product = products[tier];
    const priceId = isLive ? product.livePriceId : product.testPriceId;

    const successUrl = new URL('/checkout/success', url.origin);
    successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

    const cancelUrl = new URL('/checkout/cancel', url.origin);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl.toString(),
      cancel_url: cancelUrl.toString(),
      metadata: {
        tier,
        niche: niche || 'general',
        product_name: product.name,
      },
      customer_creation: 'always',
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      allow_promotion_codes: true,
    });

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stripe checkout error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create checkout session';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
