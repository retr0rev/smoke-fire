import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { createServerSupabase } from '../_lib/supabase'
import { verifyAuth } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const supabase = createServerSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('restaurant_socials').select('*').order('sort_order')
    if (error) return res.status(500).json({ message: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'PUT') {
    const socials = req.body as any[]
    const { data: restaurant } = await supabase.from('restaurants').select('id').limit(1).single()
    if (!restaurant) return res.status(404).json({ message: 'No restaurant found' })
    for (const s of socials) {
      if (s.id) {
        await supabase.from('restaurant_socials').upsert({ ...s, restaurant_id: restaurant.id }, { onConflict: 'id' })
      } else {
        await supabase.from('restaurant_socials').insert({ ...s, restaurant_id: restaurant.id })
      }
    }
    return res.status(200).json({ success: true })
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
