import { useQuery } from '@tanstack/react-query'
import { api, type Social } from '../lib/api'

export function useSocials() {
  return useQuery<Social[]>({
    queryKey: ['socials'],
    queryFn: () => api.socials.getAll(),
  })
}
