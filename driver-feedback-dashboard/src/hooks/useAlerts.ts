import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { AlertsResponse } from '../types/api'

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => api.get<AlertsResponse>('/dashboard/alerts'),
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Poll for new alerts
  })
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (alertId: string) =>
      api.patch(`/dashboard/alerts/${alertId}/read`),
    onSuccess: () => {
      // Invalidate alerts query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    // Optimistic update
    onMutate: async (alertId) => {
      await queryClient.cancelQueries({ queryKey: ['alerts'] })
      
      const previousAlerts = queryClient.getQueryData<AlertsResponse>(['alerts'])
      
      if (previousAlerts) {
        queryClient.setQueryData<AlertsResponse>(['alerts'], {
          ...previousAlerts,
          alerts: previousAlerts.alerts.map((alert) =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          ),
          unreadCount: Math.max(0, previousAlerts.unreadCount - 1),
        })
      }
      
      return { previousAlerts }
    },
    onError: (_err, _alertId, context) => {
      // Rollback on error
      if (context?.previousAlerts) {
        queryClient.setQueryData(['alerts'], context.previousAlerts)
      }
    },
  })
}
