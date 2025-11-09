# Overview

This is a Next.js-based property rental and booking platform for Red Lobos Group. The application provides property listings, booking management, add-on services (romantic dinners, content creation studios, proposal setups, paint & sip events), and integration with Google Calendar for availability management. The platform features a custom design system built with TypeScript, Tailwind CSS, and follows atomic design principles (atoms, molecules, organisms).

## Recent Changes

**November 9, 2025 - Interactive Booking Calendar**
- **BookingCalendar Component:**
  - Created new compact BookingCalendar molecule component for date selection
  - Replaced HTML date inputs with interactive visual calendar in booking modal
  - Month navigation with previous/next buttons
  - Users click to select check-in date, then check-out date
  - Visual feedback for selected dates with gold highlighting
  - Date range highlighting between check-in and check-out dates
  
- **Booking Restrictions:**
  - Prevents selection of past dates (only today and future dates allowed)
  - Prevents selection of booked dates (fetched from property events API)
  - Booked and unavailable dates shown in grey with visual indicators
  - Past dates are non-clickable and greyed out
  
- **User Experience:**
  - Compact calendar design that fits well in booking modal
  - Legend showing selected, in-range, and unavailable dates
  - Date summary card displays selected check-in and check-out dates
  - Fetches property-specific availability when booking modal opens
  - Smooth re-selection flow: clicking new date after range completion resets checkout

- **Technical Implementation:**
  - Uses date-fns for date manipulation and validation
  - Try-catch guards for safe date parsing
  - Null-safe callbacks to prevent crashes during date reset
  - Event map for efficient availability lookups

**November 9, 2025 - Photo Gallery and Description Modal Features**
- **Photo Gallery Page:**
  - Created new `/photoGallery` route to display all property photos
  - Implemented mixed grid layout (Pinterest-style) with varying image heights
  - Fetches full image array from API and renders all property images
  - Added router guards to prevent navigation with undefined property IDs
  - "SHOW ALL PHOTOS" button on property details page navigates to gallery
  
- **Property Description Modal:**
  - Added "SHOW MORE" button to expand truncated property descriptions
  - Modal displays full property description text
  - Implemented using existing Modal molecule component pattern
  - Close button (X icon) to dismiss modal

- **Technical Improvements:**
  - Fixed image data handling to store full arrays instead of single elements
  - Added `router.isReady` checks before accessing query parameters
  - Disabled navigation buttons until router is ready to prevent errors
  - Proper useEffect dependency arrays to prevent hook warnings

**November 9, 2025 - Landing Page and Booking Modal Updates**
- **Landing Page Improvements:**
  - Removed enquiry form section from landing page
  - Updated "BOOK NOW" button to redirect to /properties page instead of /addOn page
  - Streamlined user journey for property bookings
  
- **Property Listing Page - Booking Modal:**
  - Added interactive booking modal that appears when users click "BOOK NOW"
  - Modal includes form fields for:
    - Check-in date (date picker)
    - Check-out date (date picker)
    - Number of guests (numeric input)
  - "Make Reservation" button to submit booking details
  - Modal closes and resets form after reservation
  - Booking data is logged to console (ready for backend integration)
  - Fixed React key prop warning in property listings

**November 9, 2025 - Vercel to Replit Migration**
- Migrated project from Vercel to Replit environment
- Updated development and production scripts to bind to port 5000 with 0.0.0.0 host
- Removed Husky prepare script to prevent Git config issues in Replit
- Added Replit-specific entries to .gitignore (.config, .upm, replit.nix)
- Configured deployment settings for autoscale deployment target
- All required environment variables (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET, NEXTAUTH_URL) are now stored in Replit Secrets

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Language**
- Next.js 12 (Pages Router) with React 18
- TypeScript for type safety
- Server-side rendering (SSR) and static generation capabilities

**Design System & Styling**
- Atomic Design Pattern: Components organized into atoms, molecules, and organisms
- Tailwind CSS for utility-first styling with custom theme configuration
- Styled-components for animation keyframes (slideInRight, slideInLeft, zoomIn)
- Custom color palette: gold (#BD9A68), green1 (#F9FAF1), gray1 (#6c757d)
- Montserrat custom font family

**State Management & Data Fetching**
- TanStack React Query (v5) for server state management
- React hooks (useState, useEffect) for local state
- Custom hooks (useClickOutside) for reusable logic
- Axios for HTTP requests to backend API

**Component Architecture**
- Atoms: Basic UI elements (Button, Heading, Input, Panel, Icons, Backdrop)
- Molecules: Composite components (AddOnCard, BookingCard, BookingCalendar, CalendarCell, CalendarGrid, Modal)
- Organisms: Complex components (UtilityBar, Footer, Calendar, ReserveScheduler, SelectBox)
- Layouts: Page-level structure components

**Routing & Navigation**
- Next.js file-based routing
- Dynamic routes for property details and add-on services
- Custom navigation bar with mobile-responsive hamburger menu

## Authentication & Authorization

**NextAuth.js Integration**
- Google OAuth provider for authentication
- Session-based authentication
- Google Calendar API scope for reading calendar events
- Access token management via JWT callbacks
- Session persistence across page navigations

**Security Considerations**
- Environment variables for sensitive credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET)
- Protected routes using session checks
- Secure token storage in session

## Data Layer

**Database Schema (Drizzle ORM)**
- Users table: id, username, password
- Calendar Events table: id, date, price, isBooked, bookedBy, createdAt
- Foreign key relationship between calendar events and users
- UUID generation for primary keys
- Zod schemas for input validation (insertUserSchema, insertCalendarEventSchema)

**API Structure**
- Backend endpoint: `https://properties.redlobosgroup.com`
- RESTful API endpoints:
  - GET `/server/properties` - Fetch all properties
  - GET `/server/property/{id}/images` - Get property images
  - GET `/server/property/{id}/amenities` - Get property amenities
  - GET `/server/property/{id}/events` - Get property calendar events
- Internal API route: `/api/calendar` - Fetch Google Calendar events

**Data Models**
- Property data with images, amenities, and availability
- Add-on services with descriptions and booking options
- Calendar events with pricing tiers ($500, $555)
- User bookings linked to calendar events

## Code Quality & Development Tools

**Linting & Formatting**
- ESLint with Airbnb TypeScript configuration
- Prettier for code formatting
- Husky with lint-staged for pre-commit hooks
- Type checking via TypeScript compiler

**Development Workflow**
- Yarn package manager (required, npm blocked)
- Node.js >= 16.0.0 required
- Development server on port 5000
- Hot module replacement for rapid development

# External Dependencies

## Third-Party Services

**Google Services**
- Google OAuth 2.0 for authentication
- Google Calendar API for event synchronization
- googleapis package (v148) for API integration

**Authentication**
- NextAuth.js (v4.24) for OAuth flow management
- Session management and token handling

## Image & Media

**Image Hosting**
- Cloudinary for remote image storage
- Next.js Image component for optimized delivery
- Support for domains: media-exp1.licdn.com, res.cloudinary.com

## UI Libraries & Icons

**Icon Systems**
- Font Awesome (v6.4) with React integration
- Lucide React (v0.539) for modern iconography
- Custom SVG icons for calendar, user, message, and booking states

## Utility Libraries

- date-fns (v4.1) for date manipulation and formatting
- classnames (v2.3) for conditional CSS classes
- usehooks-ts (v2.6) for React hooks utilities
- zod (v4.0) for runtime schema validation

## Database & ORM

- Drizzle ORM (v0.44) for type-safe database queries
- drizzle-zod (v0.8) for schema validation integration
- PostgreSQL-compatible schema definitions (note: specific database driver not visible in dependencies)

## Animation & Styling

- react-animations (v1.0) for keyframe animations
- styled-components (v6.0) for CSS-in-JS animations
- Tailwind CSS autoprefixer for cross-browser compatibility

## Development Dependencies

- TypeScript type definitions for Node.js and React
- ESLint plugins for React and TypeScript
- Prettier for consistent code formatting
- PostCSS for Tailwind CSS processing