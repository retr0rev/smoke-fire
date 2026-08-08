import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from './_lib/cors.js'
import { createServerSupabase } from './_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return

  const supabase = createServerSupabase()
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .limit(1)
    .single()

  if (error) return res.status(500).json({ message: error.message })
  return res.status(200).json(data)
}
