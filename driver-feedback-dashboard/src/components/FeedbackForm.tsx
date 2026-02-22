import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { feedbackSubmissionSchema, type FeedbackSubmissionFormData } from '../utils/validation'
import { EntityFeedbackSection, type EntityFeedbackData } from './EntityFeedbackSection'
import { Button } from './Button'
import { Stack } from './Stack'

export interface FeedbackFormProps {
  onSubmit: (data: FeedbackSubmissionFormData) => Promise<void>
  isSubmitting: boolean
  enabledEntities: {
    driver?: boolean
    trip?: boolean
    app?: boolean
    marshal?: boolean
  }
  employeeId: string
  tripId: string
  driverId?: string
  marshalId?: string
}

const ENTITY_TAGS = {
  driver: ['Very Polite', 'Professional', 'Safe Driving', 'Rash Driving', 'Rude Behavior', 'Late Arrival'],
  trip: ['On Time', 'Comfortable', 'Clean Vehicle', 'Delayed', 'Uncomfortable', 'Poor Route'],
  app: ['Easy to Use', 'Fast', 'Reliable', 'Confusing', 'Slow', 'Crashes'],
  marshal: ['Helpful', 'Professional', 'Responsive', 'Unhelpful', 'Rude', 'Unavailable'],
}

const defaultEntityData: EntityFeedbackData = {
  rating: 0,
  tags: [],
  comment: '',
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  onSubmit,
  isSubmitting,
  enabledEntities,
  employeeId,
  tripId,
  driverId,
  marshalId,
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackSubmissionFormData>({
    resolver: zodResolver(feedbackSubmissionSchema),
    defaultValues: {
      employeeId,
      tripId,
      entities: {
        driver: enabledEntities.driver ? { ...defaultEntityData, driverId: driverId || '' } : undefined,
        trip: enabledEntities.trip ? defaultEntityData : undefined,
        app: enabledEntities.app ? defaultEntityData : undefined,
        marshal: enabledEntities.marshal ? { ...defaultEntityData, marshalId: marshalId || '' } : undefined,
      },
    },
    mode: 'onBlur', // Validate on blur for inline validation
  })

  const onSubmitHandler = async (data: FeedbackSubmissionFormData) => {
    // Prevent duplicate submissions
    if (hasSubmitted || isSubmitting) {
      return
    }

    try {
      await onSubmit(data)
      setHasSubmitted(true)
    } catch (error) {
      // Error handling is done by parent component
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} noValidate>
      <Stack spacing={6}>
        {enabledEntities.driver && (
          <Controller
            name="entities.driver"
            control={control}
            render={({ field }) => (
              <EntityFeedbackSection
                title="Driver Feedback"
                description="Rate your experience with the driver"
                availableTags={ENTITY_TAGS.driver}
                value={field.value || defaultEntityData}
                onChange={field.onChange}
                errors={{
                  rating: errors.entities?.driver?.rating?.message,
                  tags: errors.entities?.driver?.tags?.message,
                  comment: errors.entities?.driver?.comment?.message,
                }}
                disabled={isSubmitting || hasSubmitted}
              />
            )}
          />
        )}

        {enabledEntities.trip && (
          <Controller
            name="entities.trip"
            control={control}
            render={({ field }) => (
              <EntityFeedbackSection
                title="Trip Feedback"
                description="Rate your overall trip experience"
                availableTags={ENTITY_TAGS.trip}
                value={field.value || defaultEntityData}
                onChange={field.onChange}
                errors={{
                  rating: errors.entities?.trip?.rating?.message,
                  tags: errors.entities?.trip?.tags?.message,
                  comment: errors.entities?.trip?.comment?.message,
                }}
                disabled={isSubmitting || hasSubmitted}
              />
            )}
          />
        )}

        {enabledEntities.app && (
          <Controller
            name="entities.app"
            control={control}
            render={({ field }) => (
              <EntityFeedbackSection
                title="Mobile App Feedback"
                description="Rate your experience with the mobile app"
                availableTags={ENTITY_TAGS.app}
                value={field.value || defaultEntityData}
                onChange={field.onChange}
                errors={{
                  rating: errors.entities?.app?.rating?.message,
                  tags: errors.entities?.app?.tags?.message,
                  comment: errors.entities?.app?.comment?.message,
                }}
                disabled={isSubmitting || hasSubmitted}
              />
            )}
          />
        )}

        {enabledEntities.marshal && (
          <Controller
            name="entities.marshal"
            control={control}
            render={({ field }) => (
              <EntityFeedbackSection
                title="Marshal Feedback"
                description="Rate your experience with the marshal"
                availableTags={ENTITY_TAGS.marshal}
                value={field.value || defaultEntityData}
                onChange={field.onChange}
                errors={{
                  rating: errors.entities?.marshal?.rating?.message,
                  tags: errors.entities?.marshal?.tags?.message,
                  comment: errors.entities?.marshal?.comment?.message,
                }}
                disabled={isSubmitting || hasSubmitted}
              />
            )}
          />
        )}

        {errors.entities?.root && (
          <p className="text-sm text-error" role="alert">
            {errors.entities.root.message}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            disabled={hasSubmitted || isSubmitting}
          >
            {hasSubmitted ? 'Submitted' : 'Submit Feedback'}
          </Button>
        </div>
      </Stack>
    </form>
  )
}
