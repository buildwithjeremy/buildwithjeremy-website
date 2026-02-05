import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { Resend } from 'resend';

export const prerender = false;

// Use process.env for runtime env vars (import.meta.env gets inlined at build time)

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

    const tier = session.metadata?.tier || 'Unknown';
    const niche = session.metadata?.niche || 'Unknown';
    const customerEmail = session.customer_details?.email || 'No email provided';
    const customerName = session.customer_details?.name || 'No name provided';
    const amount = session.amount_total ? `$${(session.amount_total / 100).toLocaleString()}` : 'Unknown';

    try {
      // Send notification to Jeremy
      await resend.emails.send({
        from: 'AI Employee <notifications@mail.buildwithjeremy.com>',
        to: 'jeremy+pay@buildwithjeremy.com',
        replyTo: customerEmail,
        subject: `🎉 New AI Employee Purchase: ${tier.charAt(0).toUpperCase() + tier.slice(1)} (${amount})`,
        html: `
          <h1>New AI Employee Purchase!</h1>
          <p>Someone just purchased an AI Employee setup.</p>

          <h2>Order Details</h2>
          <ul>
            <li><strong>Package:</strong> ${tier.charAt(0).toUpperCase() + tier.slice(1)}</li>
            <li><strong>Amount:</strong> ${amount}</li>
            <li><strong>Industry:</strong> ${niche}</li>
          </ul>

          <h2>Customer Details</h2>
          <ul>
            <li><strong>Name:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
          </ul>

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
          subject: `🚀 Your AI Employee Purchase Confirmation`,
          html: `
            <h1>Thanks for your purchase, ${customerName.split(' ')[0]}!</h1>
            <p>I'm excited to help you set up your AI Employee. Here's a summary of your order:</p>

            <h2>Order Details</h2>
            <ul>
              <li><strong>Package:</strong> AI Employee ${tier.charAt(0).toUpperCase() + tier.slice(1)}</li>
              <li><strong>Amount:</strong> ${amount}</li>
              <li><strong>Industry:</strong> ${niche}</li>
            </ul>

            <h2>What's Next?</h2>
            <p>I'll be reaching out within 24-48 hours to schedule your kickoff call and get started on building your AI Employee.</p>

            <p>In the meantime, if you have any questions, just reply to this email.</p>

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
