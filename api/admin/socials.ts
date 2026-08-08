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
    for (const s of socials) {
      await supabase.from('restaurant_socials').upsert(s, { onConflict: 'id' })
    }
    return res.status(200).json({ success: true })
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
