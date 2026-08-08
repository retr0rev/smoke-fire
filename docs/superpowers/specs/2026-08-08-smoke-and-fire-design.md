# Smoke & Fire — Digital Menu & Admin Dashboard

## Design Specification

**Date:** 2026-08-08
**Status:** Approved

---

## 1. Overview

Production-quality restaurant digital menu system with customer-facing menu and admin dashboard for **Smoke & Fire**, a premium dark BBQ/burger restaurant. Arabic + English localization with full RTL/LTR support. Mobile-first. All content dynamically managed through a database-backed admin panel — no hardcoded restaurant data.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TanStack Router |
| Styling | Tailwind CSS |
| 3D | Three.js via React Three Fiber |
| Data Fetching | TanStack Query |
| Forms | React Hook Form + Zod |
| Auth | Supabase Auth (email/password) |
| Database | PostgreSQL via Supabase |
| Storage | Supabase Storage |
| Backend/API | Vercel serverless functions (`/api/`) |
| i18n | Custom Context + JSON (EN/AR) |
| Deployment | Monorepo on Vercel |

---

## 3. Architecture

### 3.1 Deployment Model

Single Vercel project. React frontend served as static assets. API routes live under `/api/` as serverless functions. No separate Express server.

### 3.2 Data Flow

```
Supabase PostgreSQL <-> Vercel API Routes <-> React (TanStack Query) <-> UI
Supabase Storage    <-> Vercel API Routes <-> React (Image components)
Supabase Auth       <-> React (Auth context)
```

- **Public reads** (menu, categories, restaurant info): Client hits API routes which query Supabase. Could optionally go direct to Supabase for speed if rate limits allow, but API routing keeps a clean boundary.
- **Admin mutations**: All go through Vercel API routes with auth middleware.
- **Image uploads**: Go through API → Supabase Storage. Frontend receives a URL back.

### 3.3 Project Structure

```
smoke-and-fire/
├── src/
│   ├── app/                    # App shell, providers (Query, Auth, Lang, Router)
│   ├── components/             # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Tabs.tsx
│   │   ├── MenuItemCard.tsx
│   │   ├── SocialIcon.tsx
│   │   ├── LangSwitcher.tsx
│   │   ├── Toast.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── features/
│   │   ├── menu/               # Customer menu pages + components
│   │   ├── admin/              # Dashboard pages + components
│   │   ├── auth/               # Login, auth context, guards
│   │   └── restaurant/         # About, contact, location, hours
│   ├── lib/
│   │   ├── api.ts              # API client (fetch wrappers)
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts
│   ├── hooks/                  # useMenu, useCategories, useRestaurant, etc.
│   ├── i18n/
│   │   ├── context.tsx         # Language context + direction
│   │   ├── en.json
│   │   └── ar.json
│   ├── layouts/
│   │   ├── CustomerLayout.tsx
│   │   └── AdminLayout.tsx
│   └── routes/                 # TanStack Router route tree
├── api/                        # Vercel serverless functions
│   ├── menu.ts                 # GET /api/menu
│   ├── categories.ts           # GET /api/categories
│   ├── menu-items/
│   │   └── [id].ts
│   ├── restaurant.ts           # GET /api/restaurant
│   ├── socials.ts              # GET /api/socials
│   ├── opening-hours.ts        # GET /api/opening-hours
│   └── admin/
│       ├── login.ts
│       ├── categories.ts       # POST, PUT, DELETE
│       ├── menu-items.ts       # POST, PUT, DELETE
│       ├── settings.ts
│       ├── socials.ts
│       ├── hours.ts
│       ├── media.ts
│       └── promotions.ts
├── db/
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Demo/development data
├── public/
│   └── logo.png
├── supabase/                   # Supabase CLI config
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 4. Database Schema

### 4.1 Tables

**restaurants** — Single row (one restaurant per deployment)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | |
| logo_url | text | Supabase Storage URL |
| favicon_url | text | |
| description_en | text | |
| description_ar | text | |
| phone | text | |
| whatsapp | text | |
| email | text | |
| address_en | text | |
| address_ar | text | |
| google_maps_url | text | |
| latitude | float | |
| longitude | float | |
| currency | text | Default 'SAR' |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**categories**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| restaurant_id | uuid FK | |
| name_en | text | |
| name_ar | text | |
| description_en | text | nullable |
| description_ar | text | nullable |
| image_url | text | nullable |
| sort_order | int | |
| is_active | boolean | default true |
| slug | text | unique per restaurant |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**menu_items**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| category_id | uuid FK | |
| restaurant_id | uuid FK | |
| name_en | text | |
| name_ar | text | |
| description_en | text | |
| description_ar | text | |
| price | decimal | |
| image_url | text | nullable |
| is_available | boolean | default true |
| is_featured | boolean | default false |
| is_new | boolean | default false |
| is_popular | boolean | default false |
| is_spicy | boolean | default false |
| sort_order | int | |
| ingredients_en | text[] | nullable |
| ingredients_ar | text[] | nullable |
| allergens_en | text[] | nullable |
| allergens_ar | text[] | nullable |
| calories | int | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**restaurant_socials**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| restaurant_id | uuid FK | |
| platform | text | instagram/facebook/tiktok/whatsapp/phone/email/website |
| url | text | |
| is_enabled | boolean | default true |
| sort_order | int | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**opening_hours**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| restaurant_id | uuid FK | |
| day_of_week | int | 0=Sunday, 6=Saturday |
| open_time | time | nullable (null = closed) |
| close_time | time | nullable (null = closed) |
| is_closed | boolean | default false |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**admin_users**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| email | text | unique |
| password_hash | text | bcrypt |
| created_at | timestamptz | |
| updated_at | timestamptz | |

**media**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| restaurant_id | uuid FK | |
| url | text | Supabase Storage URL |
| alt_text | text | |
| file_name | text | |
| file_size | int | |
| mime_type | text | |
| uploaded_at | timestamptz | |

**promotions**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| restaurant_id | uuid FK | |
| title_en | text | |
| title_ar | text | |
| image_url | text | |
| link_url | text | nullable |
| is_active | boolean | |
| starts_at | timestamptz | nullable |
| ends_at | timestamptz | nullable |
| sort_order | int | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 4.2 Indexes

- `categories.restaurant_id`, `categories.sort_order`, `categories.slug`
- `menu_items.category_id`, `menu_items.restaurant_id`, `menu_items.sort_order`
- `restaurant_socials.restaurant_id`, `restaurant_socials.platform`
- `opening_hours.restaurant_id`, `opening_hours.day_of_week`
- `promotions.restaurant_id`, `promotions.is_active`

---

## 5. API Endpoints

### 5.1 Public

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/restaurant` | Restaurant info (name, logo, description, currency) |
| GET | `/api/categories` | Active categories, ordered by sort_order |
| GET | `/api/menu-items` | All items or filtered by `?category=slug` |
| GET | `/api/menu-items/[id]` | Single item detail |
| GET | `/api/socials` | Enabled social links, ordered |
| GET | `/api/opening-hours` | Weekly schedule, ordered by day |
| GET | `/api/promotions` | Active promotions within date range |

### 5.2 Admin (auth required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/session` | Verify current session |
| GET | `/api/admin/dashboard` | Overview stats |
| GET/POST/PUT/DELETE | `/api/admin/categories` | CRUD |
| GET/POST/PUT/DELETE | `/api/admin/menu-items` | CRUD |
| PUT | `/api/admin/settings` | Update restaurant info |
| GET/PUT | `/api/admin/socials` | Read/update social links |
| GET/PUT | `/api/admin/hours` | Read/update opening hours |
| GET/POST/DELETE | `/api/admin/media` | Image library |
| GET/POST/PUT/DELETE | `/api/admin/promotions` | CRUD |
| PUT | `/api/admin/change-password` | Update admin password |

---

## 6. Frontend Routes

| Path | Component | Auth |
|------|-----------|------|
| `/` | Landing/Hero | No |
| `/menu` | Full menu with category tabs | No |
| `/menu/:category` | Filtered by category slug | No |
| `/item/:id` | Item detail (or bottom sheet) | No |
| `/about` | Restaurant story | No |
| `/contact` | Contact + location + hours | No |
| `/admin/login` | Login form | No |
| `/admin` | Dashboard overview | Yes |
| `/admin/categories` | Category CRUD | Yes |
| `/admin/menu-items` | Menu item list | Yes |
| `/admin/menu-items/new` | Create item form | Yes |
| `/admin/menu-items/:id` | Edit item form | Yes |
| `/admin/settings` | Restaurant settings | Yes |
| `/admin/socials` | Social media management | Yes |
| `/admin/hours` | Opening hours | Yes |
| `/admin/media` | Media library | Yes |
| `/admin/promotions` | Promotions CRUD | Yes |
| `/admin/account` | Change password | Yes |

---

## 7. Visual Design

### 7.1 Color Palette

```
Background          #0a0a0a  (near-black)
Surface             #141414  (card backgrounds)
Surface Elevated    #1a1a1a  (modals, bottom sheets)
Border              #2a2a2a  (subtle borders)

Primary Red         #e63900  (flame red)
Primary Orange      #f47b20  (ember orange)
Accent Amber        #ffb347  (glow/highlight)

Text Primary        #f5f0eb  (warm off-white)
Text Secondary      #8a7e72  (warm muted)
Text Disabled       #4a4038

Success             #2d6a4f
Error               #dc2626
Warning             #f59e0b
```

### 7.2 Typography

- **Headlines**: Bebas Neue or Anton — uppercase, commanding
- **Body**: Inter or DM Sans — clean, readable
- **Arabic**: Cairo or Tajawal — good menu legibility, strong RTL
- No more than 3 font families loaded total

### 7.3 Visual Principles

- Dark base, warm glows, sharp edges (border-radius: 4px maximum)
- Flame-toned borders on active states and dividers
- Typography-driven hierarchy — weight and scale, not color clutter
- Industrial feel: clean lines, dark surfaces, no glassmorphism
- No excessive rounded cards, no childish illustration style

### 7.4 Three.js

- Background particle canvas: 60-80 dim orange embers floating upward
- Respects `prefers-reduced-motion` — disables all motion
- Gracefully degrades to CSS gradient background when WebGL is unavailable
- Does not interfere with reading or interaction
- Uses R3F (React Three Fiber) for declarative integration

---

## 8. Component System

| Component | Purpose |
|-----------|---------|
| Button | Solid (filled), outline, ghost. 48px min touch target |
| Card | Dark surface, subtle border, compact padding |
| Badge | Colored chips: Popular=orange, Spicy=red, New=amber, Chef's=gold |
| Modal | Centered overlay (desktop), bottom sheet (mobile) |
| BottomSheet | Slides up, backdrop blur, drag handle |
| Input | Dark background, warm border, focused glow |
| Select | Styled native or custom |
| ImageUpload | Drag/click zone, preview, to Supabase Storage |
| Tabs | Horizontally scrollable category pills for mobile |
| MenuItemCard | Image + name + description + price + badges |
| SocialIcon | Icon button with platform color |
| LangSwitcher | EN \| عربي toggle |
| Toast | Bottom-positioned, brief, success/error |
| Skeleton | Loading placeholder matching card dimensions |
| EmptyState | Icon + message for empty lists |
| ConfirmDialog | Action confirmation modal |
| Table | Desktop table / mobile stacked cards |
| SEOHead | Meta + OG tags per page |

---

## 9. i18n Strategy

- Custom React Context — language state, direction (LTR/RTL), active dictionary
- JSON files: `en.json`, `ar.json` for all UI strings
- Database entities have `_en`/`_ar` column pairs for customer-facing content
- Language switcher in header and footer
- Changing language sets `dir` on `<html>`, updates body font family, flips layout
- Arabic RTL uses `dir="rtl"` — Tailwind handles the rest via logical properties

---

## 10. Authentication Flow

- **Admin login**: Supabase Auth (email/password) — admin signs in via Supabase client SDK, gets session
- **API protection**: Vercel API admin routes verify the Supabase session token from the request cookie/header
- **Server-side access**: Admin API routes use Supabase service_role key (never exposed to client) for database operations
- **Public reads**: Use Supabase anon key with Row Level Security for read-only access
- **No custom JWT**: Supabase Auth provides the JWT — we verify it, we don't issue our own
- **admin_users table**: Maps Supabase Auth user IDs to restaurant access; one admin per deployment

## 11. Security

- Admin endpoints protected by Supabase session verification middleware
- Rate limiting on auth endpoints
- CORS configured for production origin
- Helmet headers on API routes
- Input validation on all API routes with Zod
- No secrets in frontend code — only Supabase anon key and URL are public
- Service role key stored only in Vercel environment variables
- Row Level Security on Supabase tables for public/anonymous access

---

## 12. Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s on 4G |
| Largest Contentful Paint | < 2.5s on 4G |
| Total JS bundle (customer) | < 150KB gzipped |
| Fonts | Subset to Arabic + Latin, woff2 |
| Images | Lazy loaded, WebP with fallback, Supabase image transforms |
| Three.js | Loaded async, does not block menu rendering |

---

## 13. Implementation Phases

### Phase 1: Foundation
- Scaffold Vite + React + TanStack Router + Tailwind
- Build all shared components
- Customer layout + admin layout with responsive nav
- i18n engine (context, dictionaries, direction)
- Three.js ember background

### Phase 2: Customer Menu (seed data)
- Supabase schema + migrations + seed
- API client layer (TanStack Query hooks)
- Landing/hero page
- Menu page with category tabs + item cards
- Item detail bottom sheet
- About, Contact, Location, Hours pages
- Footer

### Phase 3: API Layer
- Public API routes
- Admin auth (Supabase Auth + JWT)
- Admin CRUD endpoints
- Supabase Storage integration

### Phase 4: Admin Dashboard
- Login page
- Dashboard overview
- Category management (CRUD)
- Menu item management (CRUD + reorder + images)
- Settings (restaurant info)
- Socials, Hours, Promotions
- Media library

### Phase 5: Polish
- RTL/LTR testing every page
- Mobile QA on iPhone + Android viewports
- Performance optimization
- SEO metadata
- Deployment configuration
- Documentation

---

## 14. Design Rules (Non-Negotiable)

1. No hardcoded restaurant data in components — everything from DB/API
2. Customer menu built and working before admin dashboard
3. Every page works in both EN and AR
4. Mobile-first: every feature works on phone before desktop enhancement
5. Three.js is atmosphere, not the main attraction
6. Admin dashboard is fully functional CRUD, not mocked UI
7. Single admin user model — no roles/permissions system
8. Logo is primary visual identity — design derives from it
