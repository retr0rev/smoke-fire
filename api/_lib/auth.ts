import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createServerSupabase } from './supabase.js'

export async function verifyAuth(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' })
    return false
  }

  const supabase = createServerSupabase()
  const { data: { user }, error } = await supabase.auth.getUser(authHeader.split(' ')[1])

  if (error || !user) {
    res.status(401).json({ message: 'Unauthorized' })
    return false
  }

  return true
}
