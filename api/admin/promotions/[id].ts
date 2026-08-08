import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../../_lib/cors.js'
import { createServerSupabase } from '../../_lib/supabase.js'
import { verifyAuth } from '../../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const { id } = req.query
  const supabase = createServerSupabase()

  if (req.method === 'PUT') {
    const { data, error } = await supabase.from('promotions').update(req.body).eq('id', id as string).select().single()
    if (error) return res.status(400).json({ message: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('promotions').delete().eq('id', id as string)
    if (error) return res.status(400).json({ message: error.message })
    return res.status(204).end()
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
