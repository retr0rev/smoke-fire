const crypto = require('crypto')

function hmacSha256(key, msg) {
  return crypto.createHmac('sha256', key).update(msg).digest()
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function pg(path, opts = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`
  const headers = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...opts.headers,
  }
  const res = await fetch(url, { ...opts, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Supabase error: ${res.status} ${text}`)
  }
  const ct = res.headers.get('content-type') || ''
  return ct.includes('json') ? res.json() : null
}

function json(res, data, status = 200) {
  res.setHeader('Content-Type', 'application/json')
  res.status(status).send(JSON.stringify(data))
}

function auth(req) {
  const h = req.headers.authorization
  if (!h || !h.startsWith('Bearer ')) return null
  return h.slice(7)
}

function requireAuth(req, res) {
  const token = auth(req)
  if (!token) { json(res, { message: 'Unauthorized' }, 401); return false }
  return true
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

module.exports = async function handler(req, res) {
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v))
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const m = req.method
    const url = new URL(req.url, 'http://localhost')
    const path = url.pathname

    // Public GET routes
    if (path === '/api/restaurant' && m === 'GET') {
      const data = await pg('/restaurants?limit=1')
      return json(res, data[0] || null)
    }

    if (path === '/api/categories' && m === 'GET') {
      const data = await pg('/categories?is_active=eq.true&order=sort_order')
      return json(res, data)
    }

    if (path === '/api/menu-items' && m === 'GET') {
      const cat = url.searchParams.get('category')
      if (cat) {
        const cats = await pg(`/categories?slug=eq.${cat}&limit=1`)
        if (cats[0]) {
          const data = await pg(`/menu_items?is_available=eq.true&category_id=eq.${cats[0].id}&order=sort_order&select=*,category:categories(*)`)
          return json(res, data)
        }
        return json(res, [])
      }
      const data = await pg('/menu_items?is_available=eq.true&order=sort_order&select=*,category:categories(*)')
      return json(res, data)
    }

    const mi = path.match(/^\/api\/menu-items\/(.+)$/)
    if (mi && m === 'GET') {
      const data = await pg(`/menu_items?id=eq.${mi[1]}&select=*,category:categories(*)&limit=1`)
      return json(res, data[0] || null, data[0] ? 200 : 404)
    }

    if (path === '/api/socials' && m === 'GET') {
      const data = await pg('/restaurant_socials?is_enabled=eq.true&order=sort_order')
      return json(res, data)
    }

    if (path === '/api/opening-hours' && m === 'GET') {
      const data = await pg('/opening_hours?order=day_of_week')
      return json(res, data)
    }

    if (path === '/api/promotions' && m === 'GET') {
      const data = await pg('/promotions?is_active=eq.true&order=sort_order')
      return json(res, data)
    }

    // Admin routes
    if (path === '/api/admin/session' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const { createClient } = require('@supabase/supabase-js')
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
      const { data, error } = await supabase.auth.getUser(auth(req))
      if (error || !data.user) return json(res, { message: 'Unauthorized' }, 401)
      return json(res, { user: { id: data.user.id, email: data.user.email } })
    }

    if (path === '/api/admin/dashboard' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const [cats, items, avail, unavail, feat] = await Promise.all([
        pg('/categories?select=id&limit=0', { headers: { Prefer: 'count=exact' } }).catch(() => []),
        pg('/menu_items?select=id&limit=0', { headers: { Prefer: 'count=exact' } }).catch(() => []),
        pg('/menu_items?is_available=eq.true&select=id&limit=0', { headers: { Prefer: 'count=exact' } }).catch(() => []),
        pg('/menu_items?is_available=eq.false&select=id&limit=0', { headers: { Prefer: 'count=exact' } }).catch(() => []),
        pg('/menu_items?is_featured=eq.true&select=id&limit=0', { headers: { Prefer: 'count=exact' } }).catch(() => []),
      ])
      return json(res, {
        totalCategories: cats.length || 0,
        totalItems: items.length || 0,
        availableItems: avail.length || 0,
        unavailableItems: unavail.length || 0,
        featuredItems: feat.length || 0,
      })
    }

    // Categories CRUD
    if (path === '/api/admin/categories' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/categories?order=sort_order')
      return json(res, data)
    }
    if (path === '/api/admin/categories' && m === 'POST') {
      if (!requireAuth(req, res)) return
      const data = await pg('/categories', { method: 'POST', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
      return json(res, data[0], 201)
    }
    const cid = path.match(/^\/api\/admin\/categories\/(.+)$/)
    if (cid) {
      if (!requireAuth(req, res)) return
      if (m === 'PUT') {
        const data = await pg(`/categories?id=eq.${cid[1]}`, { method: 'PATCH', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
        return json(res, data[0])
      }
      if (m === 'DELETE') {
        await pg(`/categories?id=eq.${cid[1]}`, { method: 'DELETE' })
        return res.status(204).end()
      }
    }

    // Menu items CRUD
    if (path === '/api/admin/menu-items' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/menu_items?order=sort_order&select=*,category:categories(*)')
      return json(res, data)
    }
    if (path === '/api/admin/menu-items' && m === 'POST') {
      if (!requireAuth(req, res)) return
      const data = await pg('/menu_items', { method: 'POST', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
      return json(res, data[0], 201)
    }
    const mid = path.match(/^\/api\/admin\/menu-items\/(.+)$/)
    if (mid) {
      if (!requireAuth(req, res)) return
      if (m === 'GET') {
        const data = await pg(`/menu_items?id=eq.${mid[1]}&select=*,category:categories(*)&limit=1`)
        return json(res, data[0])
      }
      if (m === 'PUT') {
        const data = await pg(`/menu_items?id=eq.${mid[1]}`, { method: 'PATCH', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
        return json(res, data[0])
      }
      if (m === 'DELETE') {
        await pg(`/menu_items?id=eq.${mid[1]}`, { method: 'DELETE' })
        return res.status(204).end()
      }
    }

    // Settings
    if (path === '/api/admin/settings' && m === 'PUT') {
      if (!requireAuth(req, res)) return
      const rest = await pg('/restaurants?limit=1')
      if (!rest[0]) return json(res, { message: 'Not found' }, 404)
      const data = await pg(`/restaurants?id=eq.${rest[0].id}`, { method: 'PATCH', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
      return json(res, data[0])
    }

    // Socials
    if (path === '/api/admin/socials' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/restaurant_socials?order=sort_order')
      return json(res, data)
    }
    if (path === '/api/admin/socials' && m === 'PUT') {
      if (!requireAuth(req, res)) return
      const rest = await pg('/restaurants?limit=1')
      if (!rest[0]) return json(res, { message: 'Not found' }, 404)
      for (const s of req.body) {
        const { id, ...rest } = s
        if (id) {
          await pg(`/restaurant_socials?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ ...rest, restaurant_id: rest[0].id }) })
        }
      }
      return json(res, { success: true })
    }

    // Hours
    if (path === '/api/admin/hours' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/opening_hours?order=day_of_week')
      return json(res, data)
    }
    if (path === '/api/admin/hours' && m === 'PUT') {
      if (!requireAuth(req, res)) return
      const rest = await pg('/restaurants?limit=1')
      if (!rest[0]) return json(res, { message: 'Not found' }, 404)
      for (const h of req.body) {
        const { id, ...rest } = h
        await pg(`/opening_hours?id=eq.${id}`, { method: 'PATCH', body: JSON.stringify({ ...rest, restaurant_id: rest[0].id }) })
      }
      return json(res, { success: true })
    }

    // Media
    if (path === '/api/admin/media' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/media?order=uploaded_at.desc')
      return json(res, data)
    }
    if (path === '/api/admin/media' && m === 'POST') {
      if (!requireAuth(req, res)) return
      return json(res, { url: req.body.file || '' })
    }
    const mm = path.match(/^\/api\/admin\/media\/(.+)$/)
    if (mm && m === 'DELETE') {
      if (!requireAuth(req, res)) return
      await pg(`/media?id=eq.${mm[1]}`, { method: 'DELETE' })
      return res.status(204).end()
    }

    // Promotions
    if (path === '/api/admin/promotions' && m === 'GET') {
      if (!requireAuth(req, res)) return
      const data = await pg('/promotions?order=sort_order')
      return json(res, data)
    }
    if (path === '/api/admin/promotions' && m === 'POST') {
      if (!requireAuth(req, res)) return
      const data = await pg('/promotions', { method: 'POST', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
      return json(res, data[0], 201)
    }
    const pid = path.match(/^\/api\/admin\/promotions\/(.+)$/)
    if (pid) {
      if (!requireAuth(req, res)) return
      if (m === 'PUT') {
        const data = await pg(`/promotions?id=eq.${pid[1]}`, { method: 'PATCH', body: JSON.stringify(req.body), headers: { Prefer: 'return=representation' } })
        return json(res, data[0])
      }
      if (m === 'DELETE') {
        await pg(`/promotions?id=eq.${pid[1]}`, { method: 'DELETE' })
        return res.status(204).end()
      }
    }

    return json(res, { message: 'Not found' }, 404)
  } catch (err) {
    console.error('API error:', err)
    return json(res, { message: 'Internal server error' }, 500)
  }
}
