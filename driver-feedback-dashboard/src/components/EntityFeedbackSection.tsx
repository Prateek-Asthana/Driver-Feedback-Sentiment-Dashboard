import React from 'react'
import { StarRating } from './StarRating'
import { TagChipGroup } from './TagChipGroup'
import { TextAreaWithCounter } from './TextAreaWithCounter'
import { Card } from './Card'
import { Stack } from './Stack'

export interface EntityFeedbackData {
  rating: number
  tags: string[]
  comment: string
}

export interface EntityFeedbackSectionProps {
  title: string
  description?: string
  availableTags: string[]
  value: EntityFeedbackData
  onChange: (data: EntityFeedbackData) => void
  errors?: {
    rating?: string
    tags?: string
    comment?: string
  }
  disabled?: boolean
}

export const EntityFeedbackSection: React.FC<EntityFeedbackSectionProps> = ({
  title,
  description,
  availableTags,
  value,
  onChange,
  errors,
  disabled = false,
}) => {
  const handleRatingChange = (rating: number) => {
    onChange({ ...value, rating })
  }

  const handleTagsChange = (tags: string[]) => {
    onChange({ ...value, tags })
  }

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ ...value, comment: event.target.value })
  }

  return (
    <Card>
      <Stack spacing={4}>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating <span className="text-error">*</span>
          </label>
          <StarRating
            value={value.rating}
            onChange={handleRatingChange}
            disabled={disabled}
            ariaLabel={`${title} rating`}
            error={errors?.rating}
          />
        </div>

        {availableTags.length > 0 && (
          <TagChipGroup
            label="Quick Feedback"
            tags={availableTags}
            selectedTags={value.tags}
            onChange={handleTagsChange}
            disabled={disabled}
            error={errors?.tags}
          />
        )}

        <TextAreaWithCounter
          label="Additional Comments (Optional)"
          placeholder="Share more details about your experience..."
          value={value.comment}
          onChange={handleCommentChange}
          disabled={disabled}
          maxLength={500}
          error={errors?.comment}
        />
      </Stack>
    </Card>
  )
}
