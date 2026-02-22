import React, { useState } from 'react'
import { Stack, FilterPanel, FeedbackCard, Button, Spinner } from '../components'
import { useFeedbackTimeline } from '../hooks'
import type { EntityType, SentimentType } from '../types/api'

export const FeedbackTimelinePage: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType | undefined>()
  const [sentiment, setSentiment] = useState<SentimentType | undefined>()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFeedbackTimeline({ entityType, sentiment })

  const allFeedback = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <Stack spacing={6}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Feedback Timeline</h1>
        <p className="mt-2 text-gray-600">View recent feedback submissions</p>
      </div>

      <FilterPanel
        entityType={entityType}
        sentiment={sentiment}
        onEntityTypeChange={setEntityType}
        onSentimentChange={setSentiment}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : allFeedback.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {allFeedback.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                isLoading={isFetchingNextPage}
                variant="outline"
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </Stack>
  )
}
