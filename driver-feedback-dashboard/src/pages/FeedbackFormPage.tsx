import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Stack, FeedbackForm, Toast, Card } from '../components'
import { useFeatureFlagContext } from '../contexts'
import { useFeedbackSubmit } from '../hooks'
import type { FeedbackSubmissionFormData } from '../utils/validation'

export const FeedbackFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { config } = useFeatureFlagContext()
  const { mutateAsync: submitFeedback, isPending, error } = useFeedbackSubmit()
  
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showErrorToast, setShowErrorToast] = useState(false)

  // Mock data - in real app, this would come from route params or context
  const employeeId = 'EMP001'
  const tripId = 'TRIP001'
  const driverId = 'DRV001'
  const marshalId = 'MAR001'

  const enabledEntities = {
    driver: config?.driverFeedback ?? false,
    trip: config?.tripFeedback ?? false,
    app: config?.appFeedback ?? false,
    marshal: config?.marshalFeedback ?? false,
  }

  const hasAnyEnabledEntity = Object.values(enabledEntities).some((enabled) => enabled)

  const handleSubmit = async (data: FeedbackSubmissionFormData) => {
    try {
      await submitFeedback(data as any) // Type assertion for API payload
      setShowSuccessToast(true)
      
      // Redirect after success
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setShowErrorToast(true)
    }
  }

  const handleRetry = () => {
    setShowErrorToast(false)
  }

  if (!hasAnyEnabledEntity) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <Container maxWidth="md">
          <Card padding="lg">
            <Stack spacing={4} align="center">
              <div className="text-center">
                <svg
                  className="h-16 w-16 mx-auto text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Feedback Options Available
                </h2>
                <p className="text-gray-600">
                  Feedback collection is currently disabled. Please contact your administrator for more information.
                </p>
              </div>
            </Stack>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Trip Feedback
            </h1>
            <p className="text-gray-600">
              Help us improve by sharing your experience
            </p>
          </div>

          <FeedbackForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            enabledEntities={enabledEntities}
            employeeId={employeeId}
            tripId={tripId}
            driverId={driverId}
            marshalId={marshalId}
          />

          {error && !showErrorToast && (
            <Card padding="md">
              <Stack direction="row" spacing={3} align="center">
                <svg
                  className="h-6 w-6 text-error flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {error instanceof Error ? error.message : 'Failed to submit feedback'}
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="text-sm font-medium text-primary hover:text-primary-hover"
                >
                  Retry
                </button>
              </Stack>
            </Card>
          )}
        </Stack>
      </Container>

      {showSuccessToast && (
        <Toast
          message="Feedback submitted successfully!"
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      {showErrorToast && (
        <Toast
          message="Failed to submit feedback. Please try again."
          type="error"
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  )
}
