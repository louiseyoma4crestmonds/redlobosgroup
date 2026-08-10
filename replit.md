# Red Lobos Group — Property & Venue Booking App

## Overview
A property and venue booking web application for Red Lobos Group. Built with a React SPA frontend (Vite) and an Express backend server.

## Stack
- **Frontend**: React 18 + TypeScript, React Router v7, Tailwind CSS, styled-components
- **Backend**: Express 5 (Node.js 20), Passport.js (Google OAuth), Stripe checkout
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

## Project Structure
```
server/
  index.ts              # Express server entry point (serves API + Vite frontend)
  routes/
    auth.ts             # Google OAuth via Passport.js
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

| Variable | Purpose | Required |
|----------|---------|----------|
| `SESSION_SECRET` | Express session signing key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | For sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | For sign-in |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments |

Google OAuth callback URL to register: `https://<your-domain>/api/auth/google/callback`

## External API
Property data is fetched client-side from `https://properties.redlobosgroup.com`.

## User Preferences
- Keep the existing project structure and component hierarchy
