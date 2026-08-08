# Smoke & Fire — Digital Menu & Admin Dashboard

Production-quality restaurant digital menu system with customer-facing menu and admin dashboard.

## Tech Stack

React 18, Vite, TanStack Router, Tailwind CSS, Three.js (R3F), TanStack Query, Supabase, Vercel

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - In the SQL Editor, run `db/migrations/001_initial.sql` to create the schema
   - In the SQL Editor, run `db/seed.sql` to populate demo data
   - In Authentication settings, enable Email/Password provider
   - Create an admin user through Authentication > Users > Add User

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase URL, anon key, and service role key.

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the admin dashboard**
   - Go to `/admin/login`
   - Sign in with your Supabase admin credentials

## Deploy to Vercel

1. Push to Vercel (or use Vercel CLI)
2. Set all environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`)
3. Deploy

## Project Structure

```
src/          — React frontend (components, features, hooks, i18n, layouts, routes, lib)
api/          — Vercel serverless functions (REST API)
db/           — Database migrations and seed data
public/       — Static assets
```

## Features

- Customer-facing digital menu with Arabic + English localization
- Full RTL/LTR support
- Mobile-first responsive design
- Three.js atmospheric ember particle background
- Complete admin dashboard for content management
- Supabase PostgreSQL + Storage backend
- Vercel serverless deployment
