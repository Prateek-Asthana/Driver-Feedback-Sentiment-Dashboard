import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { DriverListResponse, DateRangePreset, SortColumn, SortOrder } from '../types/api'

interface UseDriverListParams {
  dateRange?: DateRangePreset
  search?: string
  sortBy?: SortColumn
  sortOrder?: SortOrder
}

export function useDriverList(params: UseDriverListParams = {}) {
  const { dateRange = '7days', search, sortBy, sortOrder } = params

  return useQuery({
    queryKey: ['drivers', 'list', dateRange, search, sortBy, sortOrder],
    queryFn: () =>
      api.get<DriverListResponse>('/dashboard/drivers', {
        params: {
          dateRange,
          search,
          sortBy,
          sortOrder,
        },
      }),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  })
}
