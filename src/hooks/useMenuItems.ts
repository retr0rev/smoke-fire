import { useQuery } from '@tanstack/react-query'
import { api, type MenuItem } from '../lib/api'

export function useMenuItems(categorySlug?: string) {
  return useQuery<MenuItem[]>({
    queryKey: ['menuItems', categorySlug],
    queryFn: () => api.menuItems.getAll(categorySlug),
  })
}

export function useMenuItem(id: string) {
  return useQuery<MenuItem>({
    queryKey: ['menuItem', id],
    queryFn: () => api.menuItems.getById(id),
    enabled: !!id,
  })
}
