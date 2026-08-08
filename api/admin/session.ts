import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { createServerSupabase } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const supabase = createServerSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(authHeader.split(' ')[1])
  if (error || !user) return res.status(401).json({ message: 'Unauthorized' })
  return res.status(200).json({ user: { id: user.id, email: user.email } })
}
