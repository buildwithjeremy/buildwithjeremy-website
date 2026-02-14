# Stripe Integration Documentation

## Overview

The AI Employee product uses Stripe Checkout for payments with webhook-triggered email notifications via Resend.

## Architecture

```
User clicks "Get Started" → /api/checkout creates Stripe session → Stripe Checkout
                                                                         ↓
                                                            Payment completed
                                                                         ↓
Stripe webhook → /api/webhook → Resend emails (customer + business)
                                                                         ↓
                                                            Success page with Calendly CTA
```

## Key Files

| File | Purpose |
|------|---------|
| `src/pages/api/checkout.ts` | Creates Stripe Checkout sessions |
| `src/pages/api/webhook.ts` | Handles `checkout.session.completed` events, sends emails |
| `src/pages/checkout/success.astro` | Post-purchase success page |
| `src/pages/checkout/cancel.astro` | Checkout cancellation page |
| `src/pages/ai-employee/*/index.astro` | Product pages with checkout buttons |

## Environment Variables (Vercel)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `STRIPE_SECRET_KEY` | Live secret key (`sk_live_...`) | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) | [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) |
| `RESEND_API_KEY` | Resend API key (`re_...`) | [Resend Dashboard → API Keys](https://resend.com/api-keys) |

**Important:** These must be set in Vercel as runtime environment variables (not "Sensitive" which is build-time only).

## Stripe Products & Prices (Live)

| Product | Price ID | Amount |
|---------|----------|--------|
| AI Employee Starter | `price_1SwPuNBUNvYd8nY7YasGaThB` | $2,997 |
| AI Employee Pro | `price_1SwPuOBUNvYd8nY7woIg0cmQ` | $4,497 |
| AI Employee Agency | `price_1SwPuOBUNvYd8nY70CQPxwlE` | $6,997 |

## Webhook Configuration

- **URL:** `https://www.buildwithjeremy.com/api/webhook` (must use `www`)
- **Events:** `checkout.session.completed`
- **Webhook ID:** `we_1SwPugBUNvYd8nY7uyFhPzMD`

### Why `www` is required

The non-www domain (`buildwithjeremy.com`) redirects to `www.buildwithjeremy.com`. POST requests lose their body and headers during redirects, breaking webhook signature verification.

## Email Configuration (Resend)

- **Sending domain:** `mail.buildwithjeremy.com` (verified)
- **From addresses:**
  - Business notifications: `AI Employee <notifications@mail.buildwithjeremy.com>`
  - Customer emails: `Jeremy at Build with Jeremy <notifications@mail.buildwithjeremy.com>`

### Emails Sent

1. **Business notification** → `jeremy+pay@buildwithjeremy.com`
   - Customer name, email, shipping address
   - Package, amount, order reference
   - Next steps checklist
   - Link to Stripe Dashboard

2. **Customer confirmation** → Customer's email
   - Package name and order reference
   - What's included (package description)
   - Next steps: Mac Mini shipping + Calendly booking link

## Testing in Production

1. Create a 100% off coupon in [Stripe Dashboard → Coupons](https://dashboard.stripe.com/coupons)
2. Run through checkout flow
3. Verify:
   - Success page displays correctly
   - Business email received at `jeremy+pay@buildwithjeremy.com`
   - Customer email received
   - Webhook shows success in Stripe Dashboard

## Common Issues

### Webhook returns 404 or redirect
- Ensure webhook URL uses `www.buildwithjeremy.com`

### Emails not sending
- Check `RESEND_API_KEY` is set in Vercel
- Verify `mail.buildwithjeremy.com` domain is verified in Resend
- Check Vercel function logs for errors

### Environment variables undefined at runtime
- Use `process.env.VAR_NAME` (not `import.meta.env`)
- Ensure vars are NOT marked as "Sensitive" in Vercel (that's build-time only)

### Checkout returns 500
- Check `STRIPE_SECRET_KEY` is set and starts with `sk_live_`
- Verify the key hasn't expired

### Emails arrive hours after checkout
This is normal behavior if the webhook URL was misconfigured at the time of checkout. Stripe automatically retries failed webhooks for up to 3 days with exponential backoff. Once the webhook URL is fixed, pending events will be delivered on the next retry.

**Timeline example:**
- Checkout completed: Thu 7:15 PM (webhook failed due to non-www URL)
- Webhook URL fixed: Thu evening
- Stripe retried webhook: Fri 2:22 PM (succeeded)
- Emails sent: Fri 2:22 PM

To check webhook delivery history: [Stripe Dashboard → Webhooks → Select endpoint → Recent deliveries](https://dashboard.stripe.com/webhooks)

## Key Expiration Reminder

The current Stripe live secret key expires around **February 12, 2025**. Rotate it before then:

1. Generate new key in [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
2. Update `STRIPE_SECRET_KEY` in [Vercel Dashboard](https://vercel.com/build-with-jeremy/buildwithjeremy-website/settings/environment-variables)
3. Redeploy

## Useful Commands

```bash
# List live products
stripe products list --live

# List webhook endpoints
stripe webhook_endpoints list --live

# Check recent events
stripe events list --live --limit 5

# Deploy to production
vercel --prod

# Push to GitHub
git push
```

## Calendly Integration

Kickoff call booking: `https://calendly.com/buildwithjeremy/ai-employee`

Used in:
- Success page CTA button
- Customer confirmation email
- Business notification (as expected next step)
