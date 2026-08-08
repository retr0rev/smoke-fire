import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { createServerSupabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const { id } = req.query
  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('id', id as string)
    .single()

  if (error) return res.status(404).json({ message: 'Not found' })
  return res.status(200).json(data)
}
