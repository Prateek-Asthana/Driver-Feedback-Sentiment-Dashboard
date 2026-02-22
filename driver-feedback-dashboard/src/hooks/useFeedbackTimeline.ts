import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { FeedbackTimelineResponse, EntityType, SentimentType } from '../types/api'

interface UseFeedbackTimelineParams {
  entityType?: EntityType
  sentiment?: SentimentType
  startDate?: string
  endDate?: string
}

export function useFeedbackTimeline(params: UseFeedbackTimelineParams = {}) {
  const { entityType, sentiment, startDate, endDate } = params

  return useInfiniteQuery({
    queryKey: ['feedbackTimeline', entityType, sentiment, startDate, endDate],
    queryFn: ({ pageParam = 1 }) =>
      api.get<FeedbackTimelineResponse>('/dashboard/feedback', {
        params: {
          page: pageParam,
          entityType,
          sentiment,
          startDate,
          endDate,
        },
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 30 * 1000,
  })
}
