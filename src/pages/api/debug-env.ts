import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const envKeys = Object.keys(process.env).filter(k =>
    k.includes('STRIPE') || k.includes('RESEND') || k.includes('VERCEL')
  ).sort();

  return new Response(
    JSON.stringify({
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 8) || 'NOT SET',
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasResendKey: !!process.env.RESEND_API_KEY,
      relevantEnvKeys: envKeys,
    }, null, 2),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
