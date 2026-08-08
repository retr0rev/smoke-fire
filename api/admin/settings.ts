import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { createServerSupabase } from '../_lib/supabase'
import { verifyAuth } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' })

  const supabase = createServerSupabase()
  const { data: restaurant } = await supabase.from('restaurants').select('id').limit(1).single()
  if (!restaurant) return res.status(404).json({ message: 'No restaurant found' })

  const { data, error } = await supabase.from('restaurants').update(req.body).eq('id', restaurant.id).select().single()
  if (error) return res.status(400).json({ message: error.message })
  return res.status(200).json(data)
}
