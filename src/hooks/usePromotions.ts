import { useQuery } from '@tanstack/react-query'
import { api, type Promotion } from '../lib/api'

export function usePromotions() {
  return useQuery<Promotion[]>({
    queryKey: ['promotions'],
    queryFn: () => api.promotions.getActive(),
  })
}
