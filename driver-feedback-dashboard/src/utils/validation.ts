import { z } from 'zod'

// Entity feedback schema
const entityFeedbackSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  tags: z.array(z.string()).default([]),
  comment: z.string().max(500, 'Comment must be 500 characters or less').optional().default(''),
})

// Driver feedback schema
const driverFeedbackSchema = entityFeedbackSchema.extend({
  driverId: z.string().min(1, 'Driver ID is required'),
})

// Marshal feedback schema
const marshalFeedbackSchema = entityFeedbackSchema.extend({
  marshalId: z.string().min(1, 'Marshal ID is required'),
})

// Complete feedback submission schema
export const feedbackSubmissionSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  tripId: z.string().min(1, 'Trip ID is required'),
  entities: z.object({
    driver: driverFeedbackSchema.optional(),
    trip: entityFeedbackSchema.optional(),
    app: entityFeedbackSchema.optional(),
    marshal: marshalFeedbackSchema.optional(),
  }).refine(
    (data) => {
      // At least one entity must have feedback
      return data.driver || data.trip || data.app || data.marshal
    },
    {
      message: 'At least one feedback section must be completed',
    }
  ),
})

export type FeedbackSubmissionFormData = z.infer<typeof feedbackSubmissionSchema>
export type EntityFeedbackFormData = z.infer<typeof entityFeedbackSchema>
