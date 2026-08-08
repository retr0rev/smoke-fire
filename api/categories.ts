import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors'
import { createServerSupabase } from './_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) return res.status(500).json({ message: error.message })
  return res.status(200).json(data)
}
