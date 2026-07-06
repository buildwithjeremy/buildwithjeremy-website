import type { APIRoute } from 'astro';

export const prerender = false;

// Runtime env vars on Vercel come through process.env (import.meta.env gets
// inlined at build time — see webhook.ts). Fall back to import.meta.env so
// local dev picks up .env files.
const MAILERLITE_API_KEY =
  process.env.MAILERLITE_API_KEY ?? import.meta.env.MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID =
  process.env.MAILERLITE_GROUP_ID ?? import.meta.env.MAILERLITE_GROUP_ID;

const MAILERLITE_SUBSCRIBERS_URL = 'https://connect.mailerlite.com/api/subscribers';
const MAX_FIELD_LENGTH = 1000;
const MAX_EXTRA_FIELDS = 10;

const json = (payload: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Keep only short string values so arbitrary payloads can't be relayed to MailerLite. */
function sanitizeFields(input: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!input || typeof input !== 'object') return out;
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (Object.keys(out).length >= MAX_EXTRA_FIELDS) break;
    if (typeof value !== 'string' || !value.trim()) continue;
    if (!/^[a-z0-9_]{1,64}$/i.test(key)) continue;
    out[key] = value.trim().slice(0, MAX_FIELD_LENGTH);
  }
  return out;
}

async function createSubscriber(apiKey: string, body: Record<string, unknown>) {
  return fetch(MAILERLITE_SUBSCRIBERS_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ success: false, error: 'Invalid JSON body.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 200) : '';
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 200) : '';
  const extraFields = sanitizeFields(body.fields);

  // Basic validation
  if (!email || !email.includes('@') || email.length > 320) {
    return json({ success: false, error: 'A valid email is required.' }, 400);
  }

  // If MailerLite is not configured, still return success (graceful degradation)
  if (!MAILERLITE_API_KEY) {
    console.warn('[newsletter] MAILERLITE_API_KEY not set — skipping subscriber creation');
    return json({ success: true }, 200);
  }

  const fields: Record<string, string> = { ...extraFields };
  if (name) fields.name = name;
  if (source) fields.source = source;

  const subscriberBody: Record<string, unknown> = { email };
  if (Object.keys(fields).length > 0) subscriberBody.fields = fields;
  if (MAILERLITE_GROUP_ID) subscriberBody.groups = [MAILERLITE_GROUP_ID];

  try {
    const response = await createSubscriber(MAILERLITE_API_KEY, subscriberBody);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[newsletter] MailerLite API error:', response.status, errorText);

      // A custom-field mismatch (e.g. field not created in MailerLite yet) can
      // 4xx the whole request — retry with a minimal body so the lead is never lost.
      if (Object.keys(fields).length > 0) {
        const minimalBody: Record<string, unknown> = { email };
        if (name) minimalBody.fields = { name };
        if (MAILERLITE_GROUP_ID) minimalBody.groups = [MAILERLITE_GROUP_ID];
        const retry = await createSubscriber(MAILERLITE_API_KEY, minimalBody);
        if (!retry.ok) {
          console.error('[newsletter] MailerLite minimal retry failed:', retry.status, await retry.text());
        }
      }
    }
  } catch (err) {
    console.error('[newsletter] Failed to submit to MailerLite:', err);
  }

  // Always return success to not block the user experience
  return json({ success: true }, 200);
};
