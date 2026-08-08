import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors.js'
import { createServerSupabase } from '../_lib/supabase.js'
import { verifyAuth } from '../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const supabase = createServerSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('opening_hours').select('*').order('day_of_week')
    if (error) return res.status(500).json({ message: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'PUT') {
    const hours = req.body as any[]
    for (const h of hours) {
      await supabase.from('opening_hours').upsert(h, { onConflict: 'restaurant_id, day_of_week' })
    }
    return res.status(200).json({ success: true })
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
