import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { DriverAnalytics } from '../types/api'

export function useDriverDetail(driverId: string | undefined) {
  return useQuery({
    queryKey: ['drivers', 'detail', driverId],
    queryFn: () => api.get<DriverAnalytics>(`/dashboard/drivers/${driverId}`),
    enabled: !!driverId, // Only run query if driverId is provided
    staleTime: 30 * 1000,
  })
}
