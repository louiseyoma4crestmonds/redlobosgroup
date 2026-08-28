# Red Lobos Group — Property & Venue Booking App

## Overview

A property and venue booking web application for Red Lobos Group. Built with a React SPA frontend (Vite) and an Express backend server.

## Stack

- **Frontend**: React 18 + TypeScript, React Router v7, Tailwind CSS, styled-components
- **Backend**: Express 5 (Node.js 20), Passport.js (Google OAuth + email/password accounts), Stripe checkout
- **Build tool**: Vite 8
- **Runtime**: tsx (TypeScript execution for the Express server)

## How to Run

### Development

```bash
yarn dev
```

Starts the Express server on port 5000 with Vite HMR middleware integrated. Single process, single port.

### Production Build

```bash
yarn build   # Builds React app to dist/
yarn start   # Serves built app via Express
```

The server automatically applies pending versioned PostgreSQL migrations before
it starts accepting requests. This initializes a fresh database and upgrades an
existing one without a separate production SQL step. Migration files live in
`migrations/`; do not delete or edit an already-applied migration.

## Project Structure

```
server/
  index.ts              # Express server entry point (serves API + Vite frontend)
  routes/
    auth.ts             # Google OAuth, customer accounts, password reset, admin login
    admin.ts            # Admin portal and owner-only administrator management APIs
    stripe.ts           # Stripe checkout session creation
src/
  App.tsx               # React Router routes
  main.tsx              # Vite entry point
  context/
    AuthContext.tsx      # Auth context replacing next-auth (useSession, signIn, signOut)
  api/
    index.ts            # Client-side API helpers (calls external property API)
  pages/                # React page components
  atoms/                # Atomic UI components
  molecules/            # Composite components
  organisms/            # Page-level components (UtilityBar, Footer, Calendar)
  data/
    addOnData.ts        # Add-on services data
public/                 # Static assets served at root URL
styles/
  globals.css           # Tailwind base styles + font definitions
index.html              # Vite HTML entry point
vite.config.ts          # Vite configuration
```

## Environment Variables / Secrets

| Variable                | Purpose                                                                                           | Required           |
| ----------------------- | ------------------------------------------------------------------------------------------------- | ------------------ |
| `SESSION_SECRET`        | Express session signing key                                                                       | Yes                |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID                                                                            | For sign-in        |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret                                                                        | For sign-in        |
| `STRIPE_SECRET_KEY`     | Stripe secret key                                                                                 | For payments       |
| `RESEND_API_KEY`        | Sends customer password-reset and admin notification emails                                       | For email delivery |
| `PRODUCTION_URL`        | Trusted public app origin used in production password-reset links                                 | Production         |
| `DATABASE_URL`          | PostgreSQL connection used for users, bookings, and persistent sessions                           | Production         |
| `DATABASE_SSL`          | Use `true` for hosted PostgreSQL requiring SSL; use `false` for a local non-SSL PostgreSQL server | Ubuntu deployment  |
| `TRUST_PROXY`           | Number of trusted reverse proxies; use `1` behind Nginx, `false` when Node is directly exposed    | Ubuntu deployment  |
| `SESSION_COOKIE_SECURE` | Override secure session cookies; keep `true` behind HTTPS, use `false` only for HTTP testing      | Optional           |
| `ADMIN_EMAIL`           | Owner email; the owner can manage additional admin accounts                                       | Admin portal       |
| `ADMIN_PASSWORD`        | Owner password stored only as a secret                                                            | Admin portal       |

Google OAuth callback URL to register: `https://<your-domain>/api/auth/google/callback`

Additional administrators sign in through `/admin/login`. Only the owner configured
with `ADMIN_EMAIL` and `ADMIN_PASSWORD` can open `/admin/accounts`, create additional
administrators, or revoke their access.

### Ubuntu reverse-proxy authentication

The production server uses secure cookies and a PostgreSQL session store. When running
behind Nginx, forward the original protocol and host, set `TRUST_PROXY=1`, and serve
the site over HTTPS:

```nginx
location / {
    proxy_pass http://127.0.0.1:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Run one production server process or use the shared PostgreSQL session store when
using PM2 or another process manager. Do not use `SESSION_COOKIE_SECURE=false`
on a public HTTP deployment.

## External API

Property data is fetched client-side from `https://properties.redlobosgroup.com`.

## User Preferences

- Keep the existing project structure and component hierarchy
