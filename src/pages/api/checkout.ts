import type { APIRoute } from 'astro';
import Stripe from 'stripe';

// Disable prerendering for this API route (server-side only)
export const prerender = false;

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

// Product configuration with Stripe price IDs
// Price IDs - uses live prices in production, test prices in development
const isProduction = import.meta.env.PROD;

const products: Record<string, { name: string; priceId: string; price: number }> = {
  starter: {
    name: 'AI Employee Starter',
    priceId: isProduction ? 'price_1SwPuNBUNvYd8nY7YasGaThB' : 'price_1SvwiJBUNvYd8nY7UdWUHfZa',
    price: 2997,
  },
  pro: {
    name: 'AI Employee Pro',
    priceId: isProduction ? 'price_1SwPuOBUNvYd8nY7woIg0cmQ' : 'price_1SvwiOBUNvYd8nY7bFFUyiX4',
    price: 4497,
  },
  agency: {
    name: 'AI Employee Agency',
    priceId: isProduction ? 'price_1SwPuOBUNvYd8nY70CQPxwlE' : 'price_1SvwiPBUNvYd8nY7IKvBIXPD',
    price: 6997,
  },
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { tier, niche } = body;

    if (!tier || !products[tier]) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier selected' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const product = products[tier];
    const successUrl = new URL('/checkout/success', url.origin);
    successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');

    const cancelUrl = new URL('/checkout/cancel', url.origin);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: product.priceId,
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
