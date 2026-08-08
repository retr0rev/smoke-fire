import { useQuery } from '@tanstack/react-query'
import { api, type Category } from '../lib/api'

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll(),
  })
}
