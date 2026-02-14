# Stripe Integration Documentation

## Overview

Two product lines use Stripe:
1. **AI Employee** — one-time purchases via Stripe Checkout
2. **Custom Software** — monthly subscriptions (hosting + add-ons) via Stripe Checkout in subscription mode

Both use webhook-triggered email notifications via Resend.

## Architecture

### AI Employee (one-time)
```
User clicks "Get Started" → /api/checkout creates Stripe session → Stripe Checkout
                                                                         ↓
                                                            Payment completed
                                                                         ↓
Stripe webhook → /api/webhook → Resend emails (customer + business)
                                                                         ↓
                                                            Success page with Calendly CTA
```

### Custom Software (subscription)
```
User selects plan + add-ons → /api/subscribe creates subscription session → Stripe Checkout
                                                                                  ↓
                                                                     Subscription created
                                                                                  ↓
Stripe webhook → /api/webhook (detects mode=subscription) → Resend emails
                                                                                  ↓
                                                            /checkout/subscription-success
```

## Key Files

| File | Purpose |
|------|---------|
| **Shared** | |
| `src/config/pricing.ts` | **Single source of truth** for all Custom Software pricing (IDs, amounts, labels) |
| `src/pages/api/webhook.ts` | Handles `checkout.session.completed` for both one-time and subscription checkouts |
| **AI Employee** | |
| `src/pages/api/checkout.ts` | Creates one-time payment Stripe sessions |
| `src/pages/checkout/success.astro` | Post-purchase success page |
| `src/pages/checkout/cancel.astro` | Checkout cancellation page |
| `src/pages/ai-employee/*/index.astro` | Product pages with checkout buttons |
| **Custom Software** | |
| `src/pages/api/subscribe.ts` | Creates subscription Stripe sessions (imports from `pricing.ts`) |
| `src/pages/custom-software/index.astro` | Plan selection page with add-on toggles (imports from `pricing.ts`) |
| `src/pages/checkout/subscription-success.astro` | Post-subscription success page |

## Environment Variables (Vercel)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `STRIPE_SECRET_KEY` | Live secret key (`sk_live_...`) | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret (`whsec_...`) | [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) |
| `RESEND_API_KEY` | Resend API key (`re_...`) | [Resend Dashboard → API Keys](https://resend.com/api-keys) |

**Important:** These must be set in Vercel as runtime environment variables (not "Sensitive" which is build-time only).

## Stripe Products & Prices (Live)

### AI Employee (one-time)

| Product | Price ID | Amount |
|---------|----------|--------|
| AI Employee Starter | `price_1SwPuNBUNvYd8nY7YasGaThB` | $2,997 |
| AI Employee Pro | `price_1SwPuOBUNvYd8nY7woIg0cmQ` | $4,497 |
| AI Employee Agency | `price_1SwPuOBUNvYd8nY70CQPxwlE` | $6,997 |

### Custom Software (monthly subscriptions)

> **Canonical source:** `src/config/pricing.ts` — update prices there, not here.

| Product | Product ID | Price ID | Amount |
|---------|------------|----------|--------|
| Hosting/Management (base) | `prod_TvmdpdOqPNTm8f` | `price_1Sxv3uBUNvYd8nY7SUUyUsj9` | $50/mo |
| Unlimited Edits (optional) | `prod_TvmYQSYH8lnO2f` | `price_1SxuzTBUNvYd8nY780UwbIXu` | $300/mo |
| Add-on: Client Portal | `prod_TyccJwxFG3QMqT` | `price_1T0fNIBUNvYd8nY7fK03wsFS` | $25/mo |
| Add-on: AI Automation | `prod_Tycd6rl7Hqffr9` | `price_1T0fNkBUNvYd8nY7vAv2r5lV` | $25/mo |
| Add-on: Video Generation | `prod_Tycd2JKoH8YnJE` | `price_1T0fOFBUNvYd8nY74f3K0ahO` | $50/mo |
| Add-on: Image Generation | `prod_TycexX1Nj0dcwc` | `price_1T0fP1BUNvYd8nY79yfitxOU` | $25/mo |
| Add-on: Voice Agent | `prod_TycemVuFHUmjTz` | `price_1T0fPIBUNvYd8nY7L1JwR0HG` | $50/mo |
| Add-on: External API Integration | `prod_TycfrERGbbuL6Q` | `price_1T0fQ1BUNvYd8nY7T6NgcYVJ` | $25/mo (qty) |

### How the Custom Software pricing page works

- **Hosting ($50/mo)** is always included — it's the required base
- **Unlimited Edits (+$300/mo)** is an optional upgrade toggle
- **Add-ons ($25–$50/mo)** can be toggled independently
- API Integration supports multiple quantities (1–5)
- All prices, labels, and descriptions are driven from `src/config/pricing.ts`

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

## Changing Prices (Grandfathering Existing Subscribers)

Stripe's pricing model makes this simple. Existing subscribers stay on their current Price ID automatically — you never need to touch their subscriptions.

### Steps to change a price for new customers

1. **Stripe Dashboard** → Products → find the product → "Add another price" → set new amount → Save
2. Copy the new Price ID (starts with `price_`)
3. **Edit `src/config/pricing.ts`** — update the `priceId` and `amount` for that product:
   ```typescript
   export const hosting = {
     ...
     priceId: 'price_NEW_ID_HERE',  // ← new Price ID
     amount: 7500,                   // ← new amount in cents
     ...
   };
   ```
4. **Deploy** (`git push` triggers Vercel)
5. Done. New customers pay the new price. Existing subscribers stay on the old price.

### Why this works

- Each Stripe subscription stores the specific Price ID it was created with
- Changing the Price ID in your code only affects **new** checkout sessions
- Old subscriptions continue billing at the old Price ID until manually changed
- To migrate an existing subscriber to a new price, update their subscription in Stripe Dashboard

### Adding a new add-on

1. Create the Product + Price in Stripe Dashboard
2. Add it to the `addons` object in `src/config/pricing.ts`
3. Deploy — the page and API route pick it up automatically

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
