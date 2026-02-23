import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * Reusable 1-5 star rating with hover states
 * Accessibility: keyboard navigation support
 */
const StarRating = ({
  value = 0,
  onChange,
  size = 'md',
  readonly = false,
  interactive = true,
  label = 'Rating',
  required = false,
  ariaLabel = 'Rate this',
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClass = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const containerClass = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  }[size];

  const handleClick = (rating) => {
    if (!readonly && interactive) {
      onChange?.(rating);
    }
  };

  const handleKeyDown = (e, rating) => {
    if (readonly) return;

    if (e.key === 'ArrowRight' && rating < 5) {
      onChange?.(rating + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && rating > 1) {
      onChange?.(rating - 1);
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      onChange?.(rating);
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}

      <div
        className={`flex ${containerClass}`}
        role="radiogroup"
        aria-label={ariaLabel}
      >
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleClick(rating)}
            onMouseEnter={() => !readonly && setHoverValue(rating)}
            onMouseLeave={() => setHoverValue(0)}
            onKeyDown={(e) => handleKeyDown(e, rating)}
            role="radio"
            aria-checked={value === rating}
            tabIndex={interactive ? 0 : -1}
            disabled={readonly || !interactive}
            className={`
              ${sizeClass}
              transition-all duration-150 cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full
              disabled:cursor-not-allowed disabled:opacity-50
              hover:scale-110
            `}
            title={`Rate ${rating} star${rating !== 1 ? 's' : ''}`}
          >
            <Star
              size={24}
              className={`
                w-full h-full transition-all duration-150
                ${
                  rating <= (hoverValue || value)
                    ? 'fill-accent stroke-accent'
                    : 'stroke-slate-300'
                }
              `}
            />
          </button>
        ))}
      </div>

      {/* Show rating text */}
      {value > 0 && (
        <p className="text-sm text-slate-600 mt-2">
          {value} out of 5 stars
        </p>
      )}
    </div>
  );
};

export default StarRating;
