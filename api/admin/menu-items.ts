import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors.js'
import { createServerSupabase } from '../_lib/supabase.js'
import { verifyAuth } from '../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const supabase = createServerSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('menu_items').select('*, category:categories(*)').order('sort_order')
    if (error) return res.status(500).json({ message: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    const { data, error } = await supabase.from('menu_items').insert(req.body).select().single()
    if (error) return res.status(400).json({ message: error.message })
    return res.status(201).json(data)
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
