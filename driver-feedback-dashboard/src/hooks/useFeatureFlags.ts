import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { FeatureFlagConfig } from '../types/api'

export function useFeatureFlags() {
  return useQuery({
    queryKey: ['featureFlags'],
    queryFn: () => api.get<FeatureFlagConfig>('/config/feature-flags'),
    staleTime: 5 * 60 * 1000, // 5 minutes - feature flags don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
