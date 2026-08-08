import { useQuery } from '@tanstack/react-query'
import { api, type OpeningHour } from '../lib/api'

export function useOpeningHours() {
  return useQuery<OpeningHour[]>({
    queryKey: ['openingHours'],
    queryFn: () => api.openingHours.getAll(),
  })
}
