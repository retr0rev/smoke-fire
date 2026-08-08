import { supabase } from './supabase'

const BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  }
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  restaurant: { get: () => request<Restaurant>('/restaurant') },
  categories: { getAll: () => request<Category[]>('/categories') },
  menuItems: {
    getAll: (categorySlug?: string) =>
      request<MenuItem[]>(`/menu-items${categorySlug ? `?category=${categorySlug}` : ''}`),
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
      create: (data: any) => request<Category>('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<Category>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => request<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
    },
    menuItems: {
      getAll: () => request<MenuItem[]>('/admin/menu-items'),
      getById: (id: string) => request<MenuItem>(`/admin/menu-items/${id}`),
      create: (data: any) => request<MenuItem>('/admin/menu-items', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<MenuItem>(`/admin/menu-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => request<void>(`/admin/menu-items/${id}`, { method: 'DELETE' }),
    },
    settings: { update: (data: any) => request<Restaurant>('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }) },
    socials: {
      getAll: () => request<Social[]>('/admin/socials'),
      update: (data: any[]) => request<{ success: boolean }>('/admin/socials', { method: 'PUT', body: JSON.stringify(data) }),
    },
    hours: {
      getAll: () => request<OpeningHour[]>('/admin/hours'),
      update: (data: any[]) => request<{ success: boolean }>('/admin/hours', { method: 'PUT', body: JSON.stringify(data) }),
    },
    media: {
      getAll: () => request<MediaItem[]>('/admin/media'),
      upload: (file: File) => {
        const fd = new FormData()
        fd.append('file', file)
        return request<MediaItem>('/admin/media', { method: 'POST', body: fd })
      },
      delete: (id: string) => request<void>(`/admin/media/${id}`, { method: 'DELETE' }),
    },
    promotions: {
      getAll: () => request<Promotion[]>('/admin/promotions'),
      create: (data: any) => request<Promotion>('/admin/promotions', { method: 'POST', body: JSON.stringify(data) }),
      update: (id: string, data: any) => request<Promotion>(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
      delete: (id: string) => request<void>(`/admin/promotions/${id}`, { method: 'DELETE' }),
    },
  },
}

export interface Restaurant { id: string; name: string; logo_url: string | null; description_en: string; description_ar: string; phone: string | null; whatsapp: string | null; email: string | null; address_en: string | null; address_ar: string | null; google_maps_url: string | null; currency: string }
export interface Category { id: string; restaurant_id: string; name_en: string; name_ar: string; description_en?: string | null; description_ar?: string | null; image_url?: string | null; sort_order: number; is_active: boolean; slug: string }
export interface MenuItem { id: string; category_id: string; restaurant_id: string; name_en: string; name_ar: string; description_en: string; description_ar: string; price: number; image_url: string | null; is_available: boolean; is_featured: boolean; is_new: boolean; is_popular: boolean; is_spicy: boolean; sort_order: number; ingredients_en: string[] | null; ingredients_ar: string[] | null; allergens_en: string[] | null; allergens_ar: string[] | null; calories: number | null; category?: Category }
export interface Social { id: string; platform: string; url: string; is_enabled: boolean; sort_order: number }
export interface OpeningHour { id: string; day_of_week: number; open_time: string | null; close_time: string | null; is_closed: boolean }
export interface Promotion { id: string; title_en: string; title_ar: string; image_url: string | null; link_url: string | null; is_active: boolean; starts_at: string | null; ends_at: string | null; sort_order: number }
export interface DashboardStats { totalCategories: number; totalItems: number; availableItems: number; unavailableItems: number; featuredItems: number }
export interface MediaItem { id: string; url: string; alt_text: string | null; file_name: string; file_size: number; mime_type: string }
