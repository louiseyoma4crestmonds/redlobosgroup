---
name: Email sending
description: How admin booking notification emails are sent; why Gmail SMTP was abandoned in favour of Resend.
---

## Rule
Use Resend SDK (`import { Resend } from "resend"`) for all transactional email. Do not attempt Gmail SMTP.

**Why:** Gmail SMTP consistently rejected App Passwords with `535 5.7.8 BadCredentials` regardless of credential correctness or nodemailer config (tried `service: 'gmail'`, explicit `host: smtp.gmail.com port: 587`, port 465). Root cause unclear — likely a Google Workspace account policy. Resend worked immediately.

## How to apply
- `RESEND_API_KEY` secret → Resend API key.
- `ADMIN_EMAIL` secret → plain email address for the admin inbox (must be extractable via regex; sanitize with `/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/`).
- `from` address is currently `onboarding@resend.dev` (Resend shared test sender). To use a branded address, verify a domain in the Resend dashboard and update the `from` field in `server/email.ts`.
- `EMAIL_USER` and `EMAIL_PASS` secrets are no longer used for sending; they remain in the environment but the email module ignores them.
