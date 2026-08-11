---
name: Stripe credentials field name
description: The Replit Stripe connector returns credentials under different field names than the official template assumes.
---

# Stripe Credential Field Name

The `stripe-replit-sync` code template uses `settings.secret_key` and `settings.webhook_secret` to read Stripe credentials from the Replit connector API response. However, the **actual field names** returned by the Replit connector API are:

- `settings.secret` (not `settings.secret_key`)
- `settings.publishable` (not `settings.publishable_key`)
- `settings.webhook_secret` — correct as-is (may be absent)

**Why:** The Replit Stripe connector stores credentials under shorter key names internally.

**How to apply:** In `server/stripeClient.ts`, always read `settings.secret` not `settings.secret_key`. If this is re-scaffolded from the official template, remember to fix this field name or the credentials fetch will silently fail with "missing secret key."
