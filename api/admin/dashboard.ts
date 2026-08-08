import type { VercelRequest, VercelResponse } from '@vercel/node'
import { cors } from '../_lib/cors'
import { createServerSupabase } from '../_lib/supabase'
import { verifyAuth } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res)) return
  if (!(await verifyAuth(req, res))) return

  const supabase = createServerSupabase()
  const [
    { count: totalCategories },
    { count: totalItems },
    { count: availableItems },
    { count: unavailableItems },
    { count: featuredItems },
  ] = await Promise.all([
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', true),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_available', false),
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('is_featured', true),
  ])

  return res.status(200).json({
    totalCategories: totalCategories || 0,
    totalItems: totalItems || 0,
    availableItems: availableItems || 0,
    unavailableItems: unavailableItems || 0,
    featuredItems: featuredItems || 0,
  })
}
