import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';

export const prerender = false;

// Use process.env for runtime env vars (import.meta.env gets inlined at build time)

// Package details for email descriptions
const packageDetails: Record<string, { name: string; description: string }> = {
  starter: {
    name: 'AI Employee Starter',
    description: 'Done-for-you AI employee setup with Mac Mini M4, 4 tool integrations, 3-day warm-up period, brand voice training, security configuration, and 14 days email support.',
  },
  pro: {
    name: 'AI Employee Pro',
    description: 'Everything in Starter, plus: 6 tool integrations, 1-week warm-up period, custom automations, 30 days email support, and priority setup.',
  },
  agency: {
    name: 'AI Employee Agency',
    description: 'White-glove AI employee setup with Mac Mini M4, 10 tool integrations, 2-week warm-up period, Priority Slack channel, 60 days support, and quarterly tune-up call.',
  },
};

export const POST: APIRoute = async ({ request }) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
  const resend = new Resend(process.env.RESEND_API_KEY || '');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const tier = session.metadata?.tier || 'starter';
    const productName = session.metadata?.product_name || packageDetails[tier]?.name || 'AI Employee';
    const customerEmail = session.customer_details?.email || 'No email provided';
    const customerName = session.customer_details?.name || 'No name provided';
    const firstName = customerName.split(' ')[0];

    // Use subtotal (pre-discount price) for display, fallback to total
    const displayAmount = session.amount_subtotal
      ? `$${(session.amount_subtotal / 100).toLocaleString()}`
      : session.amount_total
        ? `$${(session.amount_total / 100).toLocaleString()}`
        : null;

    // Generate a short order reference from session ID
    const orderRef = session.id.slice(-8).toUpperCase();

    // Get package description
    const packageInfo = packageDetails[tier] || packageDetails.starter;

    // Get shipping address if available
    const shipping = session.collected_information?.shipping_details;
    const shippingAddress = shipping ? `${shipping.name}, ${shipping.address?.line1}, ${shipping.address?.city}, ${shipping.address?.state} ${shipping.address?.postal_code}` : null;

    try {
      // Send notification to Jeremy
      await resend.emails.send({
        from: 'AI Employee <notifications@mail.buildwithjeremy.com>',
        to: 'jeremy+pay@buildwithjeremy.com',
        replyTo: customerEmail,
        subject: `🎉 New AI Employee Purchase: ${productName}`,
        html: `
          <h1>New AI Employee Purchase!</h1>

          <h2>Customer</h2>
          <ul>
            <li><strong>Name:</strong> ${customerName}</li>
            <li><strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a></li>
            ${shippingAddress ? `<li><strong>Shipping:</strong> ${shippingAddress}</li>` : ''}
          </ul>

          <h2>Order</h2>
          <ul>
            <li><strong>Package:</strong> ${productName}</li>
            ${displayAmount ? `<li><strong>Amount:</strong> ${displayAmount}</li>` : ''}
            <li><strong>Order Ref:</strong> ${orderRef}</li>
          </ul>

          <h2>Next Steps</h2>
          <ol>
            <li>Order Mac Mini M4 for shipping to customer</li>
            <li>Customer will book kickoff call via Calendly</li>
          </ol>

          <p><a href="https://dashboard.stripe.com/payments/${session.payment_intent}">View in Stripe Dashboard</a></p>
        `,
      });
      console.log('Purchase notification email sent to Jeremy');

      // Send confirmation email to customer
      if (customerEmail && customerEmail !== 'No email provided') {
        await resend.emails.send({
          from: 'Jeremy at Build with Jeremy <notifications@mail.buildwithjeremy.com>',
          to: customerEmail,
          replyTo: 'jeremy@buildwithjeremy.com',
          subject: `🚀 Your AI Employee is on the way!`,
          html: `
            <h1>Thanks for your purchase, ${firstName}!</h1>

            <p>I'm excited to get started on your AI Employee. Here's what happens next:</p>

            <h2>Your Order</h2>
            <ul>
              <li><strong>Package:</strong> ${productName}</li>
              <li><strong>Order Ref:</strong> ${orderRef}</li>
            </ul>

            <p><strong>What's included:</strong> ${packageInfo.description}</p>

            <h2>Next Steps</h2>
            <ol>
              <li><strong>Mac Mini ships in 24-48 hours</strong> — I'll order your dedicated Mac Mini M4 and send you tracking info once it ships.</li>
              <li><strong>Book your kickoff call now</strong> — Let's get your AI Employee configured. <a href="https://calendly.com/buildwithjeremy/ai-employee">Schedule your kickoff call here</a>.</li>
            </ol>

            <p>Questions? Just reply to this email.</p>

            <p>Looking forward to working with you!</p>

            <p>— Jeremy</p>
          `,
        });
        console.log('Confirmation email sent to customer');
      }
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
