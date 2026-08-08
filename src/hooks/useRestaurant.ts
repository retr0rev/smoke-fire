import { useQuery } from '@tanstack/react-query'
import { api, type Restaurant } from '../lib/api'

export function useRestaurant() {
  return useQuery<Restaurant>({
    queryKey: ['restaurant'],
    queryFn: () => api.restaurant.get(),
  })
}
