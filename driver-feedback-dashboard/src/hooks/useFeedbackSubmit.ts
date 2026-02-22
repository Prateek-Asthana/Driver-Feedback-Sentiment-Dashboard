import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { FeedbackSubmissionPayload, FeedbackSubmissionResponse } from '../types/api'

export function useFeedbackSubmit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FeedbackSubmissionPayload) =>
      api.post<FeedbackSubmissionResponse>('/feedback', data),
    onSuccess: () => {
      // Invalidate relevant queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['drivers'] })
      queryClient.invalidateQueries({ queryKey: ['feedbackTimeline'] })
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
    },
    retry: 1, // Only retry once for mutations
  })
}
