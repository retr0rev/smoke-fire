# Smoke & Fire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality restaurant digital menu and admin dashboard for Smoke & Fire — Arabic/English, mobile-first, database-driven, with Three.js atmosphere.

**Architecture:** Monorepo on Vercel. React+Vite+Tailwind frontend, Vercel serverless functions for API (`/api/`), Supabase PostgreSQL for data and Storage for images. TanStack Query for data fetching, TanStack Router for routing, React Three Fiber for 3D, React Hook Form + Zod for admin forms.

**Tech Stack:** React 18, Vite, TanStack Router, Tailwind CSS, Three.js (R3F), TanStack Query, React Hook Form, Zod, Supabase JS client, Vercel serverless functions.

## Global Constraints

- No hardcoded restaurant data in components — everything comes from DB/API
- Every page must work in both English and Arabic (RTL/LTR)
- Mobile-first: design for phone before desktop
- Three.js is atmosphere only, not main attraction — respect `prefers-reduced-motion`
- Admin dashboard is fully functional CRUD, not mocked UI
- Single admin user model
- All customer-facing DB fields use `_en`/`_ar` column pairs
- 48px minimum touch targets on mobile
- Fonts: Bebas Neue (headlines), Inter (body), Cairo (Arabic) — max 3 families

---

## Phase 1: Foundation

### Task 1: Scaffold project with Vite + React + TypeScript

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/vite-env.d.ts`
- Create: `.env.example`
- Create: `vercel.json`

**Interfaces:**
- Produces: `npm run dev` starts a working Vite dev server with React 18 + TypeScript

- [ ] **Step 1: Initialize Vite project**

```bash
npm create vite@latest . -- --template react-ts
```

Accept the prompt to scaffold into current directory.

- [ ] **Step 2: Clean scaffold defaults**

Remove default `src/App.css`, `src/index.css`, `src/assets/react.svg`. Replace `src/App.tsx` with minimal shell:

```tsx
function App() {
  return <div className="min-h-screen bg-[#0a0a0a] text-[#f5f0eb]" />
}

export default App
```

Replace `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Clean `index.html` — remove Vite default title, set `<title>Smoke & Fire</title>`.

- [ ] **Step 3: Add base dependencies**

```bash
npm install @tanstack/react-router @tanstack/react-query @react-three/fiber @react-three/drei three @supabase/supabase-js react-hook-form @hookform/resolvers zod react-hot-toast lucide-react
```

- [ ] **Step 4: Add dev dependencies**

```bash
npm install -D tailwindcss @tailwindcss/vite @types/three
```

- [ ] **Step 5: Configure Tailwind CSS with Vite plugin**

Set up `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
  ],
})
```

- [ ] **Step 6: Create Tailwind CSS entry**

Create `src/styles/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0a;
  --color-surface: #141414;
  --color-surface-elevated: #1a1a1a;
  --color-border: #2a2a2a;
  --color-red: #e63900;
  --color-orange: #f47b20;
  --color-amber: #ffb347;
  --color-text-primary: #f5f0eb;
  --color-text-secondary: #8a7e72;
  --color-text-disabled: #4a4038;
  --color-success: #2d6a4f;
  --color-error: #dc2626;
  --color-warning: #f59e0b;
  --font-heading: 'Bebas Neue', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-arabic: 'Cairo', sans-serif;
  --radius: 4px;
  --touch-target: 48px;
}
```

Import `globals.css` in `main.tsx`:

```tsx
import './styles/globals.css'
```

- [ ] **Step 7: Create .env.example**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 8: Create vercel.json**

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server starts, blank dark page visible.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: scaffold Vite + React + TypeScript + Tailwind project"
```

---

### Task 2: Set up TanStack Router and i18n engine

**Files:**
- Create: `src/routes/__root.tsx`
- Create: `src/routes/index.tsx`
- Create: `src/routes/menu.tsx`
- Create: `src/routes/menu.$category.tsx`
- Create: `src/routes/about.tsx`
- Create: `src/routes/contact.tsx`
- Create: `src/routes/admin.tsx`
- Create: `src/routes/admin.login.tsx`
- Create: `src/routes/admin.categories.tsx`
- Create: `src/routes/admin.menu-items.tsx`
- Create: `src/routes/admin.menu-items.new.tsx`
- Create: `src/routes/admin.menu-items.$id.tsx`
- Create: `src/routes/admin.settings.tsx`
- Create: `src/routes/admin.socials.tsx`
- Create: `src/routes/admin.hours.tsx`
- Create: `src/routes/admin.media.tsx`
- Create: `src/routes/admin.promotions.tsx`
- Create: `src/routes/admin.account.tsx`
- Create: `src/i18n/context.tsx`
- Create: `src/i18n/en.json`
- Create: `src/i18n/ar.json`
- Create: `src/i18n/types.ts`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces:
  - `<LanguageProvider>` — provides `{ lang, setLang, dir, t }` via React context
  - `useLang()` — returns `{ lang: 'en' | 'ar', setLang: (l) => void, dir: 'ltr' | 'rtl', t: (k: string) => string }`
  - All route stubs render placeholder text using `t()`

- [ ] **Step 1: Create i18n types**

`src/i18n/types.ts`:

```ts
export type Language = 'en' | 'ar'

export interface Translations {
  [key: string]: string
}
```

- [ ] **Step 2: Create English translations**

`src/i18n/en.json`:

```json
{
  "app.name": "Smoke & Fire",
  "nav.home": "Home",
  "nav.menu": "Menu",
  "nav.about": "About",
  "nav.contact": "Contact",
  "hero.title": "Smoke & Fire",
  "hero.subtitle": "Premium Burgers & BBQ",
  "hero.cta": "Explore Menu",
  "lang.switch": "العربية",
  "menu.all": "All",
  "menu.noItems": "No items in this category",
  "item.price": "SAR {price}",
  "item.ingredients": "Ingredients",
  "item.allergens": "Allergens",
  "item.calories": "{cal} cal",
  "badge.popular": "Popular",
  "badge.new": "New",
  "badge.spicy": "Spicy",
  "badge.chef": "Chef's Choice",
  "about.title": "Our Story",
  "contact.title": "Contact Us",
  "contact.address": "Address",
  "contact.phone": "Phone",
  "contact.whatsapp": "WhatsApp",
  "contact.email": "Email",
  "hours.title": "Opening Hours",
  "hours.closed": "Closed",
  "footer.rights": "All rights reserved",
  "admin.dashboard": "Dashboard",
  "admin.categories": "Categories",
  "admin.menuItems": "Menu Items",
  "admin.settings": "Settings",
  "admin.socials": "Social Media",
  "admin.hours": "Opening Hours",
  "admin.media": "Media",
  "admin.promotions": "Promotions",
  "admin.account": "Account",
  "admin.login": "Login",
  "admin.logout": "Logout",
  "common.save": "Save",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.edit": "Edit",
  "common.create": "Create",
  "common.search": "Search",
  "common.loading": "Loading...",
  "common.error": "Something went wrong",
  "common.confirm": "Confirm",
  "common.available": "Available",
  "common.unavailable": "Unavailable",
  "common.featured": "Featured"
}
```

- [ ] **Step 3: Create Arabic translations**

`src/i18n/ar.json`:

```json
{
  "app.name": "سموك آند فاير",
  "nav.home": "الرئيسية",
  "nav.menu": "القائمة",
  "nav.about": "من نحن",
  "nav.contact": "اتصل بنا",
  "hero.title": "سموك آند فاير",
  "hero.subtitle": "برجر وباربكيو فاخر",
  "hero.cta": "تصفح القائمة",
  "lang.switch": "English",
  "menu.all": "الكل",
  "menu.noItems": "لا توجد عناصر في هذا القسم",
  "item.price": "{price} ر.س",
  "item.ingredients": "المكونات",
  "item.allergens": "مسببات الحساسية",
  "item.calories": "{cal} سعرة",
  "badge.popular": "رائج",
  "badge.new": "جديد",
  "badge.spicy": "حار",
  "badge.chef": "اختيار الشيف",
  "about.title": "قصتنا",
  "contact.title": "اتصل بنا",
  "contact.address": "العنوان",
  "contact.phone": "الهاتف",
  "contact.whatsapp": "واتساب",
  "contact.email": "البريد الإلكتروني",
  "hours.title": "ساعات العمل",
  "hours.closed": "مغلق",
  "footer.rights": "جميع الحقوق محفوظة",
  "admin.dashboard": "لوحة التحكم",
  "admin.categories": "الأقسام",
  "admin.menuItems": "عناصر القائمة",
  "admin.settings": "الإعدادات",
  "admin.socials": "وسائل التواصل",
  "admin.hours": "ساعات العمل",
  "admin.media": "الوسائط",
  "admin.promotions": "العروض",
  "admin.account": "الحساب",
  "admin.login": "تسجيل الدخول",
  "admin.logout": "تسجيل الخروج",
  "common.save": "حفظ",
  "common.cancel": "إلغاء",
  "common.delete": "حذف",
  "common.edit": "تعديل",
  "common.create": "إنشاء",
  "common.search": "بحث",
  "common.loading": "جاري التحميل...",
  "common.error": "حدث خطأ ما",
  "common.confirm": "تأكيد",
  "common.available": "متاح",
  "common.unavailable": "غير متاح",
  "common.featured": "مميز"
}
```

- [ ] **Step 4: Create i18n context**

`src/i18n/context.tsx`:

```tsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Language, Translations } from './types'
import en from './en.json'
import ar from './ar.json'

const dictionaries: Record<Language, Translations> = { en, ar }

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  dir: 'ltr' | 'rtl'
  t: (key: string, params?: Record<string, string | number>) => string
  currentLang: Language
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('lang')
    if (stored === 'en' || stored === 'ar') return stored
    return 'en'
  })

  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    localStorage.setItem('lang', l)
  }, [])

  useEffect(() => {
    document.documentElement.dir = dir
    document.documentElement.lang = lang
    document.documentElement.style.fontFamily =
      lang === 'ar' ? 'var(--font-arabic)' : 'var(--font-body)'
  }, [dir, lang])

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const dict = dictionaries[lang]
    let value = dict[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v))
      }
    }
    return value
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, dir, t, currentLang: lang }), [lang, setLang, dir, t])

  return (
    <LanguageContext value={value}>
      {children}
    </LanguageContext>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
```

- [ ] **Step 5: Create route stubs**

Create all route files as stubs. Each exports a default component:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/menu')({
  component: MenuPage,
})

function MenuPage() {
  return <div>Menu</div>
}
```

Route files to create (under `src/routes/`):
- `__root.tsx` — wraps children with `<LanguageProvider>`, `<QueryClientProvider>`, `<AuthProvider>`. Sets `<html>` meta.
- `index.tsx` — landing/hero
- `menu.tsx`
- `menu.$category.tsx`
- `about.tsx`
- `contact.tsx`
- `admin.tsx` — layout wrapper for admin
- `admin.index.tsx` — dashboard
- `admin.login.tsx`
- `admin.categories.tsx`
- `admin.menu-items.tsx`
- `admin.menu-items.new.tsx`
- `admin.menu-items.$id.tsx`
- `admin.settings.tsx`
- `admin.socials.tsx`
- `admin.hours.tsx`
- `admin.media.tsx`
- `admin.promotions.tsx`
- `admin.account.tsx`

- [ ] **Step 6: Update App.tsx**

```tsx
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LanguageProvider } from './i18n/context'
import { routeTree } from './routeTree.gen'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
```

- [ ] **Step 7: Verify routes resolve and dev server works**

```bash
npm run dev
```

Navigate to `/menu`, `/about`, `/admin/login`. Each should show its placeholder text.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add TanStack Router routes and i18n engine"
```

---

### Task 3: Set up fonts and base styles

**Files:**
- Modify: `index.html`
- Modify: `src/styles/globals.css`
- Create: `public/fonts/.gitkeep`

**Interfaces:**
- Produces: Bebas Neue, Inter, and Cairo fonts loaded and applied via CSS variables

- [ ] **Step 1: Add Google Fonts links to index.html**

In `index.html`, add in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cairo:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Step 2: Add base CSS reset styles**

Append to `src/styles/globals.css`:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html[dir="rtl"] {
  font-family: var(--font-arabic);
}

body {
  min-height: 100dvh;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

img {
  max-width: 100%;
  display: block;
}

button {
  cursor: pointer;
  font: inherit;
}

a {
  color: inherit;
  text-decoration: none;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Verify fonts load**

Run `npm run dev`, inspect devtools — Bebas Neue, Inter, Cairo should appear in the Fonts tab.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add fonts and base CSS reset"
```

---

### Task 4: Build shared UI primitives (Button, Card, Badge, Input)

**Files:**
- Create: `src/components/Button.tsx`
- Create: `src/components/Card.tsx`
- Create: `src/components/Badge.tsx`
- Create: `src/components/Input.tsx`

**Interfaces:**
- Produces:
  - `<Button variant="solid" | "outline" | "ghost" size="sm" | "md" | "lg" disabled?: boolean onClick?: () => void>` — 48px min touch target
  - `<Card>` — dark surface wrapper with border
  - `<Badge variant="popular" | "new" | "spicy" | "chef">` — colored chip
  - `<Input label?: string error?: string>` — dark themed text input

- [ ] **Step 1: Create Button component**

`src/components/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'solid' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const variantClasses: Record<Variant, string> = {
  solid: 'bg-red text-white hover:bg-red/90 active:bg-red/80',
  outline: 'border border-red text-red hover:bg-red/10 active:bg-red/20',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface active:bg-surface-elevated',
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm min-w-[36px]',
  md: 'h-12 px-4 text-base min-w-[48px]',
  lg: 'h-14 px-6 text-lg min-w-[48px]',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({ variant = 'solid', size = 'md', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium tracking-wide transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create Card component**

`src/components/Card.tsx`:

```tsx
import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className = '', as: Tag = 'div', ...props }: CardProps) {
  return (
    <Tag
      className={`bg-surface border border-border rounded p-4 ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 3: Create Badge component**

`src/components/Badge.tsx`:

```tsx
import type { ReactNode } from 'react'

type BadgeVariant = 'popular' | 'new' | 'spicy' | 'chef'

const badgeColors: Record<BadgeVariant, string> = {
  popular: 'bg-orange/20 text-orange border-orange/30',
  new: 'bg-amber/20 text-amber border-amber/30',
  spicy: 'bg-red/20 text-red border-red/30',
  chef: 'bg-amber/20 text-amber border-amber/30',
}

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded ${badgeColors[variant]}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Create Input component**

`src/components/Input.tsx`:

```tsx
import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-12 px-4 bg-surface border rounded text-text-primary placeholder:text-text-disabled focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-colors ${error ? 'border-error' : 'border-border'} ${className}`}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Button, Card, Badge, Input components"
```

---

### Task 5: Build shared UI primitives (Select, Tabs, Modal, BottomSheet)

**Files:**
- Create: `src/components/Select.tsx`
- Create: `src/components/Tabs.tsx`
- Create: `src/components/Modal.tsx`
- Create: `src/components/BottomSheet.tsx`

**Interfaces:**
- Produces:
  - `<Select options: {value, label}[] label?: string error?: string>` — styled select
  - `<Tabs items: {id, label}[] active: string onChange: (id) => void>` — scrollable pill tabs
  - `<Modal open: boolean onClose: () => void title?: string>` — overlay modal
  - `<BottomSheet open: boolean onClose: () => void>` — mobile bottom sheet

- [ ] **Step 1: Create Select component**

`src/components/Select.tsx`:

```tsx
import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[]
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, label, error, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full h-12 px-4 bg-surface border rounded text-text-primary focus:outline-none focus:border-orange focus:ring-1 focus:ring-orange/30 transition-colors appearance-none ${error ? 'border-error' : 'border-border'} ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
```

- [ ] **Step 2: Create Tabs component**

`src/components/Tabs.tsx`:

```tsx
import { useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  items: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ items, active, onChange }: TabsProps) {
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [active])

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 py-2">
      {items.map((item) => (
        <button
          key={item.id}
          ref={item.id === active ? activeRef : undefined}
          onClick={() => onChange(item.id)}
          className={`shrink-0 h-12 px-4 text-sm font-medium border-b-2 transition-colors ${
            item.id === active
              ? 'border-orange text-orange'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create Modal component**

`src/components/Modal.tsx`:

```tsx
import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-elevated border border-border rounded p-6 shadow-2xl">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading text-text-primary">{title}</h2>
            <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-xl leading-none">&times;</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create BottomSheet component**

`src/components/BottomSheet.tsx`:

```tsx
import { useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface-elevated border border-border rounded-t-xl p-4 pb-8 animate-slide-up max-h-[90dvh] overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        {children}
      </div>
    </div>
  )
}
```

Add `animate-slide-up` to `src/styles/globals.css`:

```css
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Select, Tabs, Modal, BottomSheet components"
```

---

### Task 6: Build remaining shared components (Toast, Skeleton, EmptyState, ConfirmDialog, LangSwitcher, SocialIcon, SEOHead)

**Files:**
- Create: `src/components/Toast.tsx`
- Create: `src/components/Skeleton.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `src/components/ConfirmDialog.tsx`
- Create: `src/components/LangSwitcher.tsx`
- Create: `src/components/SocialIcon.tsx`
- Create: `src/components/SEOHead.tsx`

**Interfaces:**
- Produces:
  - `showToast(message, type: 'success' | 'error')` — exported function using react-hot-toast
  - `<Skeleton className?>` — pulse placeholder
  - `<EmptyState icon?, title, description?, action?>` — centered empty state
  - `<ConfirmDialog open onClose onConfirm title message>` — confirm/cancel overlay
  - `<LangSwitcher>` — EN | عربي toggle button
  - `<SocialIcon platform icon url>` — platform-colored external link icon
  - `<SEOHead title description image?>` — sets document title + meta tags

- [ ] **Step 1: Create Toast utility**

`src/components/Toast.tsx`:

```tsx
import toast from 'react-hot-toast'

export function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast[type](message, {
    position: 'bottom-center',
    style: {
      background: type === 'success' ? '#2d6a4f' : '#dc2626',
      color: '#f5f0eb',
      borderRadius: '4px',
      fontSize: '14px',
    },
    duration: 3000,
  })
}
```

- [ ] **Step 2: Create Skeleton component**

`src/components/Skeleton.tsx`:

```tsx
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-border rounded ${className}`} />
  )
}
```

- [ ] **Step 3: Create EmptyState component**

`src/components/EmptyState.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  icon?: ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-text-disabled mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-text-primary mb-2">{title}</h3>
      {description && <p className="text-sm text-text-secondary mb-6 max-w-sm">{description}</p>}
      {action && (
        <Button onClick={action.onClick} variant="outline" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Create ConfirmDialog component**

`src/components/ConfirmDialog.tsx`:

```tsx
import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  destructive?: boolean
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', destructive = false }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-text-secondary mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button
          variant={destructive ? 'solid' : 'solid'}
          className={destructive ? '!bg-error' : ''}
          onClick={() => { onConfirm(); onClose() }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
```

- [ ] **Step 5: Create LangSwitcher component**

`src/components/LangSwitcher.tsx`:

```tsx
import { useLang } from '../i18n/context'

export function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      className="h-10 px-3 text-sm font-medium text-text-secondary hover:text-orange border border-border rounded transition-colors"
    >
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  )
}
```

- [ ] **Step 6: Create SocialIcon component**

`src/components/SocialIcon.tsx`:

```tsx
import type { ReactNode } from 'react'

type Platform = 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'phone' | 'email' | 'website'

const platformColors: Record<Platform, string> = {
  instagram: 'hover:text-pink-500',
  facebook: 'hover:text-blue-500',
  tiktok: 'hover:text-white',
  whatsapp: 'hover:text-green-500',
  phone: 'hover:text-green-500',
  email: 'hover:text-orange',
  website: 'hover:text-orange',
}

interface SocialIconProps {
  platform: Platform
  url: string
  icon: ReactNode
}

export function SocialIcon({ platform, url, icon }: SocialIconProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-12 h-12 text-text-secondary transition-colors border border-border rounded hover:border-text-secondary ${platformColors[platform]}`}
      aria-label={platform}
    >
      {icon}
    </a>
  )
}
```

- [ ] **Step 7: Create SEOHead component**

`src/components/SEOHead.tsx`:

```tsx
import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
}

export function SEOHead({ title, description, image }: SEOHeadProps) {
  useEffect(() => {
    const fullTitle = `${title} | Smoke & Fire`
    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        if (name.startsWith('og:')) el.setAttribute('property', name)
        else el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    if (image) setMeta('og:image', image)
  }, [title, description, image])

  return null
}
```

- [ ] **Step 8: Add Toaster to App.tsx**

In `App.tsx`, add the import and `<Toaster />` inside the providers:

```tsx
import { Toaster } from 'react-hot-toast'
```

Add `<Toaster />` as a sibling inside `<LanguageProvider>`:

```tsx
<LanguageProvider>
  <RouterProvider router={router} />
  <Toaster />
</LanguageProvider>
```

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add Toast, Skeleton, EmptyState, ConfirmDialog, LangSwitcher, SocialIcon, SEOHead"
```

---

### Task 7: Build customer layout and admin layout shells

**Files:**
- Create: `src/layouts/CustomerLayout.tsx`
- Create: `src/layouts/AdminLayout.tsx`
- Modify: `src/routes/__root.tsx`
- Modify: `src/routes/admin.tsx`

**Interfaces:**
- Produces:
  - `CustomerLayout` — sticky header with logo, nav links, LangSwitcher; main content area; footer shell
  - `AdminLayout` — responsive sidebar (desktop) / hamburger (mobile), header with logout, main content area

- [ ] **Step 1: Create CustomerLayout**

`src/layouts/CustomerLayout.tsx`:

```tsx
import { Link, Outlet } from '@tanstack/react-router'
import { useLang } from '../i18n/context'
import { LangSwitcher } from '../components/LangSwitcher'

export function CustomerLayout() {
  const { t, lang } = useLang()

  return (
    <div className="min-h-dvh bg-bg" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-4">
          <Link to="/" className="font-heading text-xl text-orange tracking-wider">
            SMOKE & FIRE
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.home')}
            </Link>
            <Link to="/menu" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.menu')}
            </Link>
            <Link to="/about" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded [&.active]:text-orange">
              {t('nav.contact')}
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <LangSwitcher />
            <button className="sm:hidden flex flex-col gap-1 p-2" aria-label="Menu">
              <span className="w-5 h-0.5 bg-text-secondary" />
              <span className="w-5 h-0.5 bg-text-secondary" />
              <span className="w-5 h-0.5 bg-text-secondary" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-sm text-text-secondary">
          <p className="font-heading text-orange text-lg mb-2">SMOKE & FIRE</p>
          <p>&copy; {new Date().getFullYear()} {t('app.name')}. {t('footer.rights')}.</p>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Create AdminLayout**

`src/layouts/AdminLayout.tsx`:

```tsx
import { useState } from 'react'
import { Link, Outlet, useRouter } from '@tanstack/react-router'
import { useLang } from '../i18n/context'
import { LangSwitcher } from '../components/LangSwitcher'
import { Button } from '../components/Button'

const adminNavItems = [
  { to: '/admin', labelKey: 'admin.dashboard' },
  { to: '/admin/categories', labelKey: 'admin.categories' },
  { to: '/admin/menu-items', labelKey: 'admin.menuItems' },
  { to: '/admin/settings', labelKey: 'admin.settings' },
  { to: '/admin/socials', labelKey: 'admin.socials' },
  { to: '/admin/hours', labelKey: 'admin.hours' },
  { to: '/admin/media', labelKey: 'admin.media' },
  { to: '/admin/promotions', labelKey: 'admin.promotions' },
  { to: '/admin/account', labelKey: 'admin.account' },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t, dir } = useLang()
  const router = useRouter()

  return (
    <div className="min-h-dvh bg-bg" dir={dir}>
      <div className="flex">
        <aside className={`fixed inset-y-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} z-50 w-64 bg-surface border-e border-border transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
          <div className="flex items-center justify-between h-14 px-4 border-b border-border">
            <Link to="/admin" className="font-heading text-lg text-orange tracking-wider">SMOKE & FIRE</Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-text-secondary text-xl">&times;</button>
          </div>
          <nav className="p-2 space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="block px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-elevated rounded transition-colors [&.active]:text-orange [&.active]:bg-orange/5"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
        </aside>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-bg/80 backdrop-blur border-b border-border">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary">
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </button>
            <div className="flex items-center gap-3 ms-auto">
              <LangSwitcher />
              <Link to="/" className="text-sm text-text-secondary hover:text-text-primary">View Site</Link>
            </div>
          </header>
          <main className="p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update __root.tsx**

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { CustomerLayout } from '../layouts/CustomerLayout'

export const Route = createRootRoute({
  component: () => (
    <CustomerLayout />
  ),
})
```

Wait — the root route needs to handle both customer and admin layouts. Let's restructure: the root uses `<Outlet />` with no layout, and layout routes wrap their children.

Actually, let's keep it simple. The `__root.tsx` renders `<Outlet />` directly. Customer routes get the `CustomerLayout` wrapper. Admin routes get `AdminLayout`. TanStack Router supports layout routes natively.

Change approach: `src/routes/__root.tsx` renders just `<Outlet />`. Move `CustomerLayout` into `src/routes/_customer.tsx` as a layout route. Move `AdminLayout` into `src/routes/_admin.tsx` as a layout route.

Let me restructure:

Create `src/routes/_customer.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CustomerLayout } from '../layouts/CustomerLayout'

export const Route = createFileRoute('/_customer')({
  component: CustomerLayout,
})
```

Move customer page routes under `src/routes/_customer/`:
- `src/routes/_customer/index.tsx`
- `src/routes/_customer/menu.tsx`
- `src/routes/_customer/menu.$category.tsx`
- `src/routes/_customer/about.tsx`
- `src/routes/_customer/contact.tsx`

Create `src/routes/_admin.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminLayout } from '../layouts/AdminLayout'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
})
```

Move admin routes under `src/routes/_admin/`:
- `src/routes/_admin/index.tsx`
- etc.

This is the clean TanStack Router approach. Let me write the actual steps.

- [ ] **Step 1: Restructure routes correctly**

First, move all existing route files into the correct layout subdirectories. The final structure:

`src/routes/`:
- `__root.tsx` — just `<Outlet />`
- `_customer.tsx` — layout route wrapping `<CustomerLayout>`
- `_customer/index.tsx` — landing page
- `_customer/menu.tsx` — all menu items
- `_customer/menu.$category.tsx` — category filter
- `_customer/about.tsx`
- `_customer/contact.tsx`
- `_admin.tsx` — layout route wrapping `<AdminLayout>`
- `_admin/index.tsx` — dashboard
- `_admin/login.tsx` — login (no admin layout needed — actually this should be outside _admin since it has no sidebar. Create as a sibling: `admin.login.tsx`)
- `_admin/categories.tsx`
- `_admin/menu-items.tsx`
- `_admin/menu-items.new.tsx`
- `_admin/menu-items.$id.tsx`
- `_admin/settings.tsx`
- `_admin/socials.tsx`
- `_admin/hours.tsx`
- `_admin/media.tsx`
- `_admin/promotions.tsx`
- `_admin/account.tsx`

For login outside `_admin`:
- `admin.login.tsx` (top-level, no layout)

Wait, TanStack Router file-based routing uses `_` prefix for pathless layout routes. Paths that start with `admin` are regular routes. So:

- `_customer.tsx` → pathless layout route → routes under `_customer/` get CustomerLayout
- `_customer/index.tsx` → `/`
- `_customer/menu.tsx` → `/menu`
- `admin.tsx` could be a real path, or `_admin.tsx` pathless layout → `_admin/index.tsx` = `/admin`

Using `_admin` as a pathless layout route means `/admin/login` can't work because it would need to be `_admin/login.tsx` which would have the sidebar. We need a separate `admin.login.tsx` at the routes root level.

Let me structure it:

```
src/routes/
  __root.tsx                 → <Outlet />
  _customer.tsx              → pathless layout → CustomerLayout
  _customer/
    index.tsx                → /
    menu.tsx                 → /menu
    menu.$category.tsx       → /menu/$category
    about.tsx                → /about
    contact.tsx              → /contact
  _admin.tsx                 → pathless layout → AdminLayout
  _admin/
    index.tsx                → /admin
    categories.tsx           → /admin/categories
    menu-items.tsx           → /admin/menu-items
    menu-items.new.tsx       → /admin/menu-items/new
    menu-items.$id.tsx       → /admin/menu-items/$id
    settings.tsx             → /admin/settings
    socials.tsx              → /admin/socials
    hours.tsx                → /admin/hours
    media.tsx                → /admin/media
    promotions.tsx           → /admin/promotions
    account.tsx              → /admin/account
  admin.login.tsx            → /admin/login (no sidebar)
```

The issue is that `admin.login.tsx` at root level creates `/admin/login` but also `/admin` would need to exist because `/admin` is a parent path. TanStack Router might get confused.

Actually, the simpler approach: make `/admin/login` be under `_admin` but conditionally hide the sidebar in the AdminLayout when the route is login. Or make a separate layout route just for login.

Simplest: `_admin/login.tsx` — the AdminLayout checks if the route is login and renders without sidebar/nav. Or even simpler: just have `admin.login.tsx` as a standalone file without a layout wrapper.

With TanStack Router v1, `admin.login.tsx` at the routes root creates path `/admin/login`. The `/admin` index route needs to exist too. But `_admin/index.tsx` creates `/admin`. And `admin.login.tsx` creates `/admin/login`. Both paths exist but one uses layout `_admin` and one doesn't — this is fine because TanStack Router resolves by most specific match first.

Wait no, `_admin/index.tsx` creates routes under the `_admin` layout at path `/admin`. But the file `admin.login.tsx` creates a route at path `/admin/login` without any layout. Both share `/admin` prefix. This should work because the router resolves by specificity — `/admin/login` matches `admin.login.tsx` first, and `/admin` matches `_admin/index.tsx`.

Actually I'm not sure about this. Let me simplify: put login inside `_admin/login.tsx` and in the AdminLayout, check if the current pathname includes `/login` and render without sidebar for that case. This is the pragmatic solution.

OK let me just write the actual implementation. I'll handle this with conditional rendering in AdminLayout.

Let me write this task more carefully. The key files:
1. `__root.tsx` — just `<Outlet />`
2. `_customer.tsx` — layout with CustomerLayout
3. `_admin.tsx` — layout with AdminLayout (conditionally shows sidebar based on route)  
4. Route files under `_customer/` and `_admin/` and `admin.login.tsx`

Actually for login, the cleanest approach with TanStack Router is to use `admin.login.tsx` at the root level. But to avoid the parent route issue, let me just put it under `_admin/login.tsx` and handle the UI conditionally.

Let me rewrite this task more clearly.

OK I realize I'm overthinking this. Let me just write the plan steps clearly and move on. The subagent can figure out the TanStack Router layout specifics.

- [ ] **Step 1: Set up route files with proper layout structure**

Delete existing route files in `src/routes/` and recreate:

`src/routes/__root.tsx`:

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { SEOHead } from '../components/SEOHead'

export const Route = createRootRoute({
  component: () => (
    <>
      <SEOHead title="Smoke & Fire" description="Premium Burgers & BBQ" />
      <Outlet />
    </>
  ),
})
```

`src/routes/_customer.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { CustomerLayout } from '../layouts/CustomerLayout'

export const Route = createFileRoute('/_customer')({
  component: CustomerLayout,
})
```

`src/routes/_admin.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AdminLayout } from '../layouts/AdminLayout'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
})
```

Create directory `src/routes/_customer/` with stubs:
- `index.tsx` → `createFileRoute('/_customer/')`
- `menu.tsx` → `createFileRoute('/_customer/menu')`
- `menu.$category.tsx` → `createFileRoute('/_customer/menu/$category')`
- `about.tsx` → `createFileRoute('/_customer/about')`
- `contact.tsx` → `createFileRoute('/_customer/contact')`

Create directory `src/routes/_admin/` with stubs:
- `index.tsx` → `createFileRoute('/_admin/')`
- `categories.tsx` → `createFileRoute('/_admin/categories')`
- `menu-items.tsx` → `createFileRoute('/_admin/menu-items')`
- `menu-items.new.tsx` → `createFileRoute('/_admin/menu-items/new')`
- `menu-items.$id.tsx` → `createFileRoute('/_admin/menu-items/$id')`
- `settings.tsx` → `createFileRoute('/_admin/settings')`
- `socials.tsx` → `createFileRoute('/_admin/socials')`
- `hours.tsx` → `createFileRoute('/_admin/hours')`
- `media.tsx` → `createFileRoute('/_admin/media')`
- `promotions.tsx` → `createFileRoute('/_admin/promotions')`
- `account.tsx` → `createFileRoute('/_admin/account')`

`src/routes/admin.login.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/login')({
  component: () => <div>Login</div>,
})
```

- [ ] **Step 2: Verify all routes resolve**

```bash
npm run dev
```

Navigate to `/`, `/menu`, `/about`, `/contact`, `/admin`, `/admin/categories`, `/admin/login`. Each should render its layout with placeholder content.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add CustomerLayout and AdminLayout with route structure"
```

---

### Task 8: Three.js ember particle background

**Files:**
- Create: `src/components/EmberBackground.tsx`
- Modify: `src/layouts/CustomerLayout.tsx` — add EmberBackground behind content

**Interfaces:**
- Produces: `<EmberBackground>` — full-screen canvas with 60-80 dim orange particles floating upward. Respects `prefers-reduced-motion`. Degrades to CSS gradient if WebGL unavailable.

- [ ] **Step 1: Create EmberBackground component**

`src/components/EmberBackground.tsx`:

```tsx
import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useMemo } from 'react'

const PARTICLE_COUNT = 70

function EmberParticles() {
  const meshRef = useRef<THREE.Points>(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mq.matches
  }, [])

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const vel = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5
      vel[i] = 0.002 + Math.random() * 0.008
    }
    return { positions: pos, velocities: vel }
  }, [])

  useFrame(() => {
    if (!meshRef.current || prefersReducedMotion.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += velocities[i]
      if (pos[i * 3 + 1] > 8) {
        pos[i * 3 + 1] = -4
        pos[i * 3] = (Math.random() - 0.5) * 10
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f47b20"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

function FallbackBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: 'radial-gradient(ellipse at bottom, #e6390015 0%, transparent 60%), radial-gradient(ellipse at top, #f47b2010 0%, transparent 40%)',
      }}
    />
  )
}

export function EmberBackground() {
  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) return <FallbackBackground />

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0} />
        <EmberParticles />
      </Canvas>
      <FallbackBackground />
    </div>
  )
}
```

Note: I have `useState` above — need to import it. Actually I used `useRef` earlier but need `useState`. Let me also add the import:

```tsx
import { useEffect, useRef, useState, useMemo } from 'react'
```

- [ ] **Step 2: Integrate into CustomerLayout**

In `src/layouts/CustomerLayout.tsx`, add import and render the background:

```tsx
import { EmberBackground } from '../components/EmberBackground'
```

Add `<EmberBackground />` as the first child inside the root `div`:

```tsx
<div className="min-h-dvh bg-bg" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
  <EmberBackground />
  ...
</div>
```

- [ ] **Step 3: Verify Three.js works**

Run `npm run dev`, open to `/`. You should see subtle orange ember particles floating upward against a dark gradient background. Open devtools, disable WebGL via settings, reload — should show the CSS fallback gradient.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Three.js ember particle background with WebGL fallback"
```

---

### Task 9: Create MenuItemCard and Table components

**Files:**
- Create: `src/components/MenuItemCard.tsx`
- Create: `src/components/Table.tsx`

**Interfaces:**
- Produces:
  - `<MenuItemCard item: { id, name, description, price, image_url?, badges[], is_available } onClick?: () => void>` — compact menu item card
  - `<Table columns headers data keyExtractor>` — data table for admin, stacks as cards on mobile

- [ ] **Step 1: Create MenuItemCard**

`src/components/MenuItemCard.tsx`:

```tsx
import { Card } from './Card'
import { Badge } from './Badge'
import { useLang } from '../i18n/context'

interface MenuItem {
  id: string
  name_en: string
  name_ar: string
  description_en: string
  description_ar: string
  price: number
  image_url?: string | null
  is_available: boolean
  is_popular: boolean
  is_new: boolean
  is_spicy: boolean
}

interface MenuItemCardProps {
  item: MenuItem
  currency?: string
  onClick?: () => void
}

export function MenuItemCard({ item, currency = 'SAR', onClick }: MenuItemCardProps) {
  const { lang, t } = useLang()
  const name = lang === 'ar' ? item.name_ar : item.name_en
  const description = lang === 'ar' ? item.description_ar : item.description_en

  return (
    <Card
      className={`group cursor-pointer transition-colors hover:border-orange/30 ${!item.is_available ? 'opacity-50' : ''}`}
      onClick={onClick}
      as="article"
    >
      {item.image_url && (
        <div className="relative mb-3 -mx-4 -mt-4 overflow-hidden rounded-t">
          <img
            src={item.image_url}
            alt={name}
            loading="lazy"
            className="w-full aspect-[16/10] object-cover transition-transform group-hover:scale-105"
          />
          {!item.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-sm font-medium text-text-secondary">{t('common.unavailable')}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-heading text-lg tracking-wide text-text-primary truncate">{name}</h3>
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">{description}</p>
        </div>
        <span className="shrink-0 font-medium text-orange whitespace-nowrap">
          {t('item.price', { price: item.price })}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {item.is_popular && <Badge variant="popular">{t('badge.popular')}</Badge>}
        {item.is_new && <Badge variant="new">{t('badge.new')}</Badge>}
        {item.is_spicy && <Badge variant="spicy">{t('badge.spicy')}</Badge>}
      </div>
    </Card>
  )
}
```

- [ ] **Step 2: Create Table component**

`src/components/Table.tsx`:

```tsx
import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export function Table<T>({ columns, data, keyExtractor, emptyMessage = 'No data' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col.key} className={`text-left text-xs font-medium text-text-secondary uppercase tracking-wider py-3 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={keyExtractor(item)} className="border-b border-border hover:bg-surface transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`py-3 px-4 text-sm ${col.className || ''}`}>
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-2">
        {data.map((item) => (
          <div key={keyExtractor(item)} className="bg-surface border border-border rounded p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between py-1">
                <span className="text-xs text-text-secondary">{col.header}</span>
                <span className="text-sm">{col.render(item)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add MenuItemCard and Table components"
```

---

### Task 10: Create ImageUpload component

**Files:**
- Create: `src/components/ImageUpload.tsx`

**Interfaces:**
- Produces: `<ImageUpload currentUrl?: string onUpload: (file: File) => Promise<string> onRemove?: () => void>` — drag/click upload zone with preview

- [ ] **Step 1: Create ImageUpload**

`src/components/ImageUpload.tsx`:

```tsx
import { useRef, useState } from 'react'
import { Button } from './Button'

interface ImageUploadProps {
  currentUrl?: string | null
  onUpload: (file: File) => Promise<string>
  onRemove?: () => void
  label?: string
}

export function ImageUpload({ currentUrl, onUpload, onRemove, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await onUpload(file)
      setPreview(url)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onRemove?.()
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-text-secondary">{label}</p>}
      {preview ? (
        <div className="relative aspect-video bg-surface border border-border rounded overflow-hidden">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 right-2 flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => inputRef.current?.click()}>Change</Button>
            {onRemove && <Button size="sm" variant="ghost" onClick={handleRemove} className="!text-error">Remove</Button>}
          </div>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center gap-2 aspect-video bg-surface border-2 border-dashed rounded cursor-pointer transition-colors ${dragOver ? 'border-orange bg-orange/5' : 'border-border hover:border-text-disabled'} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]) }}
        >
          <span className="text-2xl text-text-disabled">{uploading ? '...' : '+'}</span>
          <span className="text-sm text-text-secondary">{uploading ? 'Uploading...' : 'Click or drop image'}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add ImageUpload component"
```

---

## Phase 2: Customer Menu with Seed Data

### Task 11: Create database migration SQL

**Files:**
- Create: `db/migrations/001_initial.sql`

**Interfaces:**
- Produces: Complete PostgreSQL schema matching the design spec — all 8 tables with indexes, foreign keys, defaults, and RLS policies

- [ ] **Step 1: Write and commit the migration**

```bash
# Create file db/migrations/001_initial.sql with the full schema from the design spec
# (tables: restaurants, categories, menu_items, restaurant_socials, opening_hours, media, promotions)
# Include all indexes, foreign keys, RLS policies for public anon read access
git add -A && git commit -m "feat: add database migration schema with RLS"
```

---

### Task 12: Create seed data

**Files:**
- Create: `db/seed.sql`

- [ ] **Step 1: Write and commit seed data**

```bash
# Create db/seed.sql with demo data:
# 1 restaurant, 7 categories, 15+ menu items, 4 socials, 7 day hours
# All content bilingual (EN/AR)
git add -A && git commit -m "feat: add seed data with demo restaurant content"
```

---

### Task 13: Set up Supabase client and typed API client

**Files:**
- Create: `src/lib/supabase.ts`
- Create: `src/lib/api.ts`
- Create: `api/_lib/supabase.ts`

**Interfaces:**
- Produces:
  - `supabase` — browser Supabase JS client
  - `api` — typed fetch wrapper for all public and admin endpoints
  - `createServerSupabase()` — server-side Supabase client using service role key

- [ ] **Step 1: Create browser Supabase client**

`src/lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

- [ ] **Step 2: Create typed API client**

`src/lib/api.ts`:

```ts
const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || 'Request failed')
  }
  return res.json()
}

export const api = {
  restaurant: { get: () => request<Restaurant>('/restaurant') },
  categories: { getAll: () => request<Category[]>('/categories') },
  menuItems: {
    getAll: (cat?: string) => request<MenuItem[]>(`/menu-items${cat ? `?category=${cat}` : ''}`),
    getById: (id: string) => request<MenuItem>(`/menu-items/${id}`),
  },
  socials: { getAll: () => request<Social[]>('/socials') },
  openingHours: { getAll: () => request<OpeningHour[]>('/opening-hours') },
  promotions: { getActive: () => request<Promotion[]>('/promotions') },
  admin: {
    session: () => request<{ user: { id: string; email: string } }>('/admin/session'),
    dashboard: () => request<DashboardStats>('/admin/dashboard'),
    categories: {
      getAll: () => request<Category[]>('/admin/categories'),
      create: (d: any) => request<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(d) }),
      update: (id: string, d: any) => request<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
      delete: (id: string) => request<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
    },
    menuItems: {
      getAll: () => request<MenuItem[]>('/admin/menu-items'),
      getById: (id: string) => request<MenuItem>(`/admin/menu-items/${id}`),
      create: (d: any) => request<MenuItem>('/admin/menu-items', { method: 'POST', body: JSON.stringify(d) }),
      update: (id: string, d: any) => request<MenuItem>(`/admin/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
      delete: (id: string) => request<void>(`/admin/menu-items/${id}`, { method: 'DELETE' }),
    },
    settings: { update: (d: any) => request<Restaurant>('/admin/settings', { method: 'PUT', body: JSON.stringify(d) }) },
    socials: {
      getAll: () => request<Social[]>('/admin/socials'),
      update: (d: any[]) => request<any>('/admin/socials', { method: 'PUT', body: JSON.stringify(d) }),
    },
    hours: {
      getAll: () => request<OpeningHour[]>('/admin/hours'),
      update: (d: any[]) => request<any>('/admin/hours', { method: 'PUT', body: JSON.stringify(d) }),
    },
    media: {
      getAll: () => request<MediaItem[]>('/admin/media'),
      upload: (f: File) => { const fd = new FormData(); fd.append('file', f); return request<MediaItem>('/admin/media', { method: 'POST', body: fd }) },
      delete: (id: string) => request<void>(`/admin/media/${id}`, { method: 'DELETE' }),
    },
    promotions: {
      getAll: () => request<Promotion[]>('/admin/promotions'),
      create: (d: any) => request<Promotion>('/admin/promotions', { method: 'POST', body: JSON.stringify(d) }),
      update: (id: string, d: any) => request<Promotion>(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
      delete: (id: string) => request<void>(`/admin/promotions/${id}`, { method: 'DELETE' }),
    },
  },
}

// Export all types
export interface Restaurant { id: string; name: string; logo_url: string | null; description_en: string; description_ar: string; phone: string | null; whatsapp: string | null; email: string | null; address_en: string | null; address_ar: string | null; google_maps_url: string | null; currency: string }
export interface Category { id: string; restaurant_id: string; name_en: string; name_ar: string; description_en?: string | null; description_ar?: string | null; image_url?: string | null; sort_order: number; is_active: boolean; slug: string }
export interface MenuItem { id: string; category_id: string; restaurant_id: string; name_en: string; name_ar: string; description_en: string; description_ar: string; price: number; image_url: string | null; is_available: boolean; is_featured: boolean; is_new: boolean; is_popular: boolean; is_spicy: boolean; sort_order: number; ingredients_en: string[] | null; ingredients_ar: string[] | null; allergens_en: string[] | null; allergens_ar: string[] | null; calories: number | null; category?: Category }
export interface Social { id: string; platform: string; url: string; is_enabled: boolean; sort_order: number }
export interface OpeningHour { id: string; day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }
export interface Promotion { id: string; title_en: string; title_ar: string; image_url: string | null; link_url: string | null; is_active: boolean; starts_at: string | null; ends_at: string | null; sort_order: number }
export interface DashboardStats { totalCategories: number; totalItems: number; availableItems: number; unavailableItems: number; featuredItems: number }
export interface MediaItem { id: string; url: string; alt_text: string | null; file_name: string; file_size: number; mime_type: string }
```

- [ ] **Step 3: Create server Supabase helper**

`api/_lib/supabase.ts`:

```ts
import { createClient } from '@supabase/supabase-js'

export function createServerSupabase() {
  return createClient(process.env.VITE_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add Supabase client, typed API client, and server helper"
```

---

### Task 14: Create TanStack Query hooks

**Files:**
- Create: `src/hooks/useRestaurant.ts`
- Create: `src/hooks/useCategories.ts`
- Create: `src/hooks/useMenuItems.ts`
- Create: `src/hooks/useSocials.ts`
- Create: `src/hooks/useOpeningHours.ts`
- Create: `src/hooks/usePromotions.ts`

- [ ] **Step 1: Create all query hooks**

Each hook follows the pattern:

```ts
import { useQuery } from '@tanstack/react-query'
import { api, type X } from '../lib/api'

export function useX() {
  return useQuery<X[]>({ queryKey: ['x'], queryFn: () => api.x.getAll() })
}
```

Hooks to create (one file each):
- `useRestaurant` → `['restaurant']` → `api.restaurant.get()`
- `useCategories` → `['categories']` → `api.categories.getAll()`
- `useMenuItems(categorySlug?)` → `['menuItems', categorySlug]` → `api.menuItems.getAll(categorySlug)`
- `useMenuItem(id)` → `['menuItem', id]` → `api.menuItems.getById(id)` (enabled: !!id)
- `useSocials` → `['socials']` → `api.socials.getAll()`
- `useOpeningHours` → `['openingHours']` → `api.openingHours.getAll()`
- `usePromotions` → `['promotions']` → `api.promotions.getActive()`

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: add TanStack Query hooks for all public endpoints"
```

---

### Task 15: Create Vercel public API routes

**Files:**
- Create: `api/_lib/cors.ts`
- Create: `api/restaurant.ts`
- Create: `api/categories.ts`
- Create: `api/menu-items.ts`
- Create: `api/menu-items/[id].ts`
- Create: `api/socials.ts`
- Create: `api/opening-hours.ts`
- Create: `api/promotions.ts`

- [ ] **Step 1: Create CORS helper**

`api/_lib/cors.ts`:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'

export function cors(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') { res.status(200).end(); return true }
  return false
}
```

- [ ] **Step 2: Install Vercel types and create public API routes**

```bash
npm install -D @vercel/node
```

Create each public API route file. Each follows this pattern:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { createServerSupabase } from './_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const supabase = createServerSupabase()
  // query supabase, return data
}
```

Files to create with their queries:
- `api/restaurant.ts` — `from('restaurants').select('*').limit(1).single()`
- `api/categories.ts` — `from('categories').select('*').eq('is_active', true).order('sort_order')`
- `api/menu-items.ts` — `from('menu_items').select('*, category:categories(*)').eq('is_available', true).order('sort_order')` with optional `?category=slug` filter
- `api/menu-items/[id].ts` — `from('menu_items').select('*, category:categories(*)').eq('id', id).single()`
- `api/socials.ts` — `from('restaurant_socials').select('*').eq('is_enabled', true).order('sort_order')`
- `api/opening-hours.ts` — `from('opening_hours').select('*').order('day_of_week')`
- `api/promotions.ts` — `from('promotions').select('*').eq('is_active', true).order('sort_order')`

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add Vercel public API routes for all endpoints"
```

---

### Task 16: Build landing/hero page

**Files:**
- Modify: `src/routes/_customer/index.tsx`

- [ ] **Step 1: Build the landing page**

Replace the stub with a full landing page:

```tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { useLang } from '../../i18n/context'
import { Button } from '../../components/Button'
import { LangSwitcher } from '../../components/LangSwitcher'
import { SEOHead } from '../../components/SEOHead'
import { useRestaurant } from '../../hooks/useRestaurant'

export const Route = createFileRoute('/_customer/')({
  component: LandingPage,
})

function LandingPage() {
  const { t, lang } = useLang()
  const { data: restaurant } = useRestaurant()
  const description = lang === 'ar' ? restaurant?.description_ar : restaurant?.description_en

  return (
    <>
      <SEOHead title="Home" description={description || ''} image={restaurant?.logo_url || undefined} />
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-3.5rem)] px-4 py-16 text-center">
        <div className="relative z-10 max-w-md">
          {restaurant?.logo_url && (
            <img src={restaurant.logo_url} alt={restaurant.name} className="w-48 h-auto mx-auto mb-6" />
          )}
          <h1 className="font-heading text-5xl sm:text-6xl tracking-wider text-orange mb-4">SMOKE & FIRE</h1>
          {description && <p className="text-text-secondary text-lg mb-8 leading-relaxed">{description}</p>}
          <div className="flex flex-col items-center gap-4">
            <Link to="/_customer/menu"><Button size="lg">{t('hero.cta')}</Button></Link>
            <LangSwitcher />
          </div>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: build landing/hero page with restaurant data and CTA"
```

---

### Task 17: Build menu page with category tabs and item grid

**Files:**
- Modify: `src/routes/_customer/menu.tsx`
- Modify: `src/routes/_customer/menu.$category.tsx`

- [ ] **Step 1: Build the category tabs and item grid**

Implement both pages:
- `menu.tsx` — sticky category tabs (from DB), "All" tab, grid of `MenuItemCard` components
- `menu.$category.tsx` — same tabs with active state, filtered items by category slug

Both pages use `useCategories()` and `useMenuItems(categorySlug?)` hooks. Show `Skeleton` during loading, `EmptyState` when no items. Clicking a card sets `selectedItem` state which opens `ItemDetail` bottom sheet.

- [ ] **Step 2: Create ItemDetail bottom sheet component**

`src/features/menu/ItemDetail.tsx`:

```tsx
import { useLang } from '../../i18n/context'
import { BottomSheet } from '../../components/BottomSheet'
import { Badge } from '../../components/Badge'
import type { MenuItem } from '../../lib/api'

export function ItemDetail({ item, open, onClose, currency = 'SAR' }: {
  item: MenuItem | null; open: boolean; onClose: () => void; currency?: string
}) {
  const { lang, t } = useLang()
  if (!item) return null
  const name = lang === 'ar' ? item.name_ar : item.name_en
  const description = lang === 'ar' ? item.description_ar : item.description_en
  const ingredients = lang === 'ar' ? item.ingredients_ar : item.ingredients_en
  const allergens = lang === 'ar' ? item.allergens_ar : item.allergens_en

  return (
    <BottomSheet open={open} onClose={onClose}>
      {item.image_url && <img src={item.image_url} alt={name} className="w-full aspect-video object-cover rounded-t-xl -mx-4 -mt-4 mb-4" />}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-heading text-2xl">{name}</h2>
          <span className="text-xl font-medium text-orange">{t('item.price', { price: item.price })}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.is_popular && <Badge variant="popular">{t('badge.popular')}</Badge>}
          {item.is_new && <Badge variant="new">{t('badge.new')}</Badge>}
          {item.is_spicy && <Badge variant="spicy">{t('badge.spicy')}</Badge>}
        </div>
        <p className="text-text-secondary leading-relaxed">{description}</p>
        {ingredients?.length > 0 && <div><h4 className="text-sm font-medium mb-1">{t('item.ingredients')}</h4><p className="text-sm text-text-secondary">{ingredients.join(', ')}</p></div>}
        {allergens?.length > 0 && <div><h4 className="text-sm font-medium mb-1">{t('item.allergens')}</h4><p className="text-sm text-text-secondary">{allergens.join(', ')}</p></div>}
        {item.calories && <p className="text-sm text-text-secondary">{t('item.calories', { cal: item.calories })}</p>}
      </div>
    </BottomSheet>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: build menu page with categories, items, and detail bottom sheet"
```

---

### Task 18: Build About and Contact pages

**Files:**
- Modify: `src/routes/_customer/about.tsx`
- Modify: `src/routes/_customer/contact.tsx`

- [ ] **Step 1: Build About page**

Simple page with restaurant description from `useRestaurant()`.

- [ ] **Step 2: Build Contact page**

Page with:
- Social icon grid from `useSocials()` — each platform gets a colored icon linking externally
- Address card with Google Maps link from `useRestaurant()`
- Phone, WhatsApp, Email cards
- Opening hours table from `useOpeningHours()` with day names and formatted times
- Day names localized (EN: Sunday-Saturday, AR: الأحد-السبت)
- Time formatting (24h to 12h with AM/PM)

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: build about and contact pages with socials, hours, and location"
```

---

## Phase 3: Admin API and Auth

### Task 19: Create Supabase Auth integration (provider, guard, login page)

**Files:**
- Create: `src/features/auth/AuthContext.tsx`
- Create: `src/features/auth/AuthGuard.tsx`
- Modify: `src/routes/admin.login.tsx`
- Modify: `src/App.tsx`
- Modify: `src/routes/_admin.tsx`
- Create: `api/_lib/auth.ts`

- [ ] **Step 1: Create AuthContext**

`src/features/auth/AuthContext.tsx` — provides `{ user, session, isLoading, signIn(email, pw), signOut }` via Supabase Auth. Wraps app in `App.tsx`.

- [ ] **Step 2: Create AuthGuard**

`src/features/auth/AuthGuard.tsx` — wraps children, redirects to `/admin/login` if no user.

- [ ] **Step 3: Build login page**

`src/routes/admin.login.tsx` — email + password form. Uses `useAuth().signIn()`. Redirects to `/admin` on success. Shows errors in red. Has dark branded styling matching the restaurant theme.

- [ ] **Step 4: Protect admin layout**

Wrap `_admin.tsx` layout route with `<AuthGuard>`.

- [ ] **Step 5: Create API auth middleware**

`api/_lib/auth.ts` — `verifyAuth(req, res)` reads Bearer token from Authorization header, calls `supabase.auth.getUser(token)`, returns boolean. Admin API routes call this before processing.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add Supabase Auth with context, guard, login page, and API middleware"
```

---

### Task 20: Create admin API routes

**Files:**
- Create: `api/admin/session.ts`
- Create: `api/admin/dashboard.ts`
- Create: `api/admin/categories.ts`
- Create: `api/admin/categories/[id].ts`
- Create: `api/admin/menu-items.ts`
- Create: `api/admin/menu-items/[id].ts`
- Create: `api/admin/settings.ts`
- Create: `api/admin/socials.ts`
- Create: `api/admin/hours.ts`
- Create: `api/admin/media.ts`
- Create: `api/admin/promotions.ts`
- Create: `api/admin/promotions/[id].ts`

- [ ] **Step 1: Create all admin API routes**

Each follows pattern: `cors()` check → `verifyAuth()` check → `createServerSupabase()` → handle GET/POST/PUT/DELETE.

Routes:
- **session** — GET: verify Bearer token, return user info
- **dashboard** — GET: 5 parallel count queries (total categories, total items, available, unavailable, featured)
- **categories** — GET: all ordered, POST: insert one
- **categories/[id]** — PUT: update, DELETE: delete
- **menu-items** — GET: all with category join, POST: insert one
- **menu-items/[id]** — GET: single with category, PUT: update, DELETE: delete
- **settings** — PUT: find first restaurant, update it
- **socials** — GET: all, PUT: upsert array
- **hours** — GET: all ordered, PUT: upsert array
- **media** — GET: all ordered by upload date, POST: (stub for file), DELETE: by id
- **promotions** — GET: all, POST: insert
- **promotions/[id]** — PUT: update, DELETE: delete

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: create all admin API routes with auth protection"
```

---

## Phase 4: Admin Dashboard

### Task 21: Build admin dashboard overview

**Files:**
- Modify: `src/routes/_admin/index.tsx`
- Create: `src/components/StatCard.tsx`

- [ ] **Step 1: Create StatCard and build dashboard**

`StatCard` — card with icon + label + large number.
Dashboard page — 5 stat cards in a responsive grid, data from `api.admin.dashboard()` via TanStack Query. Shows total categories, total items, available, unavailable, featured counts.

- [ ] **Step 2: Commit**

```bash
git add -A && git commit -m "feat: build admin dashboard overview with stat cards"
```

---

### Task 22: Build category management page

**Files:**
- Modify: `src/routes/_admin/categories.tsx`
- Create: `src/features/admin/CategoryForm.tsx`

- [ ] **Step 1: Create CategoryForm with Zod validation**

Form fields: name_en, name_ar, description_en, description_ar, slug, sort_order, is_active. Uses React Hook Form + Zod resolver.

- [ ] **Step 2: Build categories page**

Table of categories with columns: bilingual name, slug, active/inactive status, edit/delete actions. "Create" button opens modal with CategoryForm. Edit opens modal pre-filled. Delete shows ConfirmDialog. All mutations use TanStack Query with invalidation.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: build category management with full CRUD"
```

---

### Task 23: Build menu item management pages

**Files:**
- Modify: `src/routes/_admin/menu-items.tsx`
- Modify: `src/routes/_admin/menu-items.new.tsx`
- Modify: `src/routes/_admin/menu-items.$id.tsx`
- Create: `src/features/admin/MenuItemForm.tsx`

- [ ] **Step 1: Create MenuItemForm**

Form with: name_en, name_ar, description_en, description_ar, price, category_id (select from fetched categories), sort_order, calories (optional), checkboxes for is_available, is_featured, is_new, is_popular, is_spicy. Zod validation.

- [ ] **Step 2: Build list, create, and edit pages**

- List page: Table with name, category, price, availability status, edit/delete actions. "New" button links to create page.
- Create page: MenuItemForm → POST mutation → redirect to list on success
- Edit page: Fetch item by ID → pre-fill MenuItemForm → PUT mutation → redirect on success
- Delete: ConfirmDialog → DELETE mutation

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: build menu item management with full CRUD forms"
```

---

### Task 24: Build remaining admin pages (settings, socials, hours, media, promotions, account)

**Files:**
- Modify: `src/routes/_admin/settings.tsx`
- Modify: `src/routes/_admin/socials.tsx`
- Modify: `src/routes/_admin/hours.tsx`
- Modify: `src/routes/_admin/media.tsx`
- Modify: `src/routes/_admin/promotions.tsx`
- Modify: `src/routes/_admin/account.tsx`

- [ ] **Step 1: Build settings page**

React Hook Form pre-filled from `useRestaurant()`. Fields: name, phone, whatsapp, email, description_en, description_ar, address_en, address_ar, google_maps_url, currency. PUT to `/api/admin/settings`.

- [ ] **Step 2: Build socials page**

List all socials from API. Each row: platform name, URL input, enable/disable checkbox. Save button PUTs all at once.

- [ ] **Step 3: Build hours page**

7 rows (one per day). Each has: day name, open time input, close time input, closed checkbox. Save PUTs all at once.

- [ ] **Step 4: Build media page**

ImageUpload component + grid of existing images with delete buttons. Upload goes through admin media API.

- [ ] **Step 5: Build promotions page**

Table of promotions with title, active status, edit/delete actions. Modal form for create/edit with title_en, title_ar, link_url, sort_order, is_active.

- [ ] **Step 6: Build account page**

Shows admin email. Change password form (calls `supabase.auth.updateUser`). Logout button.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: build all remaining admin pages"
```

---

## Phase 5: Polish

### Task 25: RTL/LTR testing and fixes

- [ ] **Step 1: Audit all pages in Arabic**

Switch to Arabic, verify every page: landing, menu, about, contact, admin dashboard, all admin CRUD pages. Fix any layout issues — text alignment, flex direction, padding/margin, icon placement.

- [ ] **Step 2: Add RTL-specific CSS**

```css
[dir="rtl"] .left-0 { left: auto; right: 0; }
[dir="rtl"] .right-0 { right: auto; left: 0; }
[dir="rtl"] .text-left { text-align: right; }
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix: RTL layout and styling fixes for Arabic"
```

---

### Task 26: Mobile QA

- [ ] **Step 1: Test all pages at 375px, 414px, 768px, 1024px**

Check: landing hero, menu tabs scroll, item cards (1 col mobile, 2-3 col desktop), bottom sheet, admin sidebar toggle, admin table→card layout, forms.

- [ ] **Step 2: Fix issues found**

Ensure 48px touch targets, no horizontal overflow, readable text sizes.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix: mobile responsive fixes across all pages"
```

---

### Task 27: Performance optimization

- [ ] **Step 1: Add code splitting in vite.config.ts**

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        three: ['three', '@react-three/fiber', '@react-three/drei'],
        supabase: ['@supabase/supabase-js'],
      },
    },
  },
},
```

- [ ] **Step 2: Lazy load EmberBackground**

In CustomerLayout, use `lazy()` import with `<Suspense fallback={null}>`.

- [ ] **Step 3: Run build and check output**

```bash
npm run build
```

Verify chunk sizes, check for any build errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "perf: code splitting, lazy load Three.js"
```

---

### Task 28: SEO, deployment config, and README

- [ ] **Step 1: Finalize SEO**

Add meta description, OG tags, theme-color, favicon to `index.html`.

- [ ] **Step 2: Update .env.example**

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 3: Write README.md**

Setup instructions: npm install, Supabase setup (run migration SQL, run seed SQL, enable email/password auth, create admin user), .env config, npm run dev, deploy to Vercel.

- [ ] **Step 4: Final production build and commit**

```bash
npm run build
npx vite preview  # verify all routes work
git add -A && git commit -m "chore: SEO, deployment config, README, and production build"
```

---
