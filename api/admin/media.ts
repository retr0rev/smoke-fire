import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors.js'
import { createServerSupabase } from '../_lib/supabase.js'
import { verifyAuth } from '../_lib/auth.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const supabase = createServerSupabase()

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('media').select('*').order('uploaded_at', { ascending: false })
    if (error) return res.status(500).json({ message: error.message })
    return res.status(200).json(data)
  }
  if (req.method === 'POST') {
    const { file } = req.body
    if (!file) return res.status(400).json({ message: 'No file provided' })
    return res.status(200).json({ url: file })
  }
  if (req.method === 'DELETE') {
    const { id } = req.query
    const { error } = await supabase.from('media').delete().eq('id', id as string)
    if (error) return res.status(400).json({ message: error.message })
    return res.status(204).end()
  }
  return res.status(405).json({ message: 'Method not allowed' })
}
