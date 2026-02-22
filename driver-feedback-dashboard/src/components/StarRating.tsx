import React, { useState } from 'react'

export interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  ariaLabel: string
  error?: string
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  disabled = false,
  size = 'medium',
  ariaLabel,
  error,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
  }

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, rating: number) => {
    if (disabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onChange(rating)
    } else if (event.key === 'ArrowRight' && rating < 5) {
      event.preventDefault()
      onChange(rating + 1)
    } else if (event.key === 'ArrowLeft' && rating > 1) {
      event.preventDefault()
      onChange(rating - 1)
    }
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className="flex flex-col gap-2">
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'star-rating-error' : undefined}
        className="flex gap-1"
      >
        {[1, 2, 3, 4, 5].map((rating) => {
          const isFilled = rating <= displayValue
          const isHovered = hoverValue !== null && rating <= hoverValue

          return (
            <button
              key={rating}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
              disabled={disabled}
              onClick={() => handleClick(rating)}
              onKeyDown={(e) => handleKeyDown(e, rating)}
              onMouseEnter={() => !disabled && setHoverValue(rating)}
              onMouseLeave={() => setHoverValue(null)}
              onFocus={() => !disabled && setHoverValue(rating)}
              onBlur={() => setHoverValue(null)}
              className={`
                ${sizeClasses[size]}
                min-w-[44px] min-h-[44px]
                flex items-center justify-center
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                rounded
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                ${isHovered ? 'scale-110' : 'scale-100'}
              `}
            >
              <svg
                className={`
                  ${sizeClasses[size]}
                  transition-colors duration-150
                  ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
                  ${isHovered && !disabled ? 'drop-shadow-md' : ''}
                `}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )
        })}
      </div>
      {error && (
        <p id="star-rating-error" className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
