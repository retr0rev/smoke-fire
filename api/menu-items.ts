import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { createServerSupabase } from './_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const supabase = createServerSupabase()
  const { category } = req.query

  let query = supabase
    .from('menu_items')
    .select('*, category:categories(*)')
    .eq('is_available', true)
    .order('sort_order')

  if (category && typeof category === 'string') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single()

    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data, error } = await query
  if (error) return res.status(500).json({ message: error.message })
  return res.status(200).json(data)
}
