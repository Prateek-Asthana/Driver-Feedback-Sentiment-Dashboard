import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { OverviewMetrics, DateRangePreset } from '../types/api'

export function useDashboardOverview(dateRange: DateRangePreset = '7days') {
  return useQuery({
    queryKey: ['dashboard', 'overview', dateRange],
    queryFn: () =>
      api.get<OverviewMetrics>('/dashboard/overview', {
        params: { dateRange },
      }),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds for real-time updates
  })
}
