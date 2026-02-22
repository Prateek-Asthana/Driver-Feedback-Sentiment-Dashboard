import React from 'react'

export interface TextAreaWithCounterProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCounter?: boolean
}

export const TextAreaWithCounter = React.forwardRef<
  HTMLTextAreaElement,
  TextAreaWithCounterProps
>(
  (
    {
      label,
      error,
      helperText,
      maxLength = 500,
      showCounter = true,
      className = '',
      id,
      value = '',
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
    const currentLength = String(value).length

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            value={value}
            maxLength={maxLength}
            className={`
              w-full px-3 py-2 min-h-[100px]
              border rounded-lg
              text-gray-900 placeholder-gray-400
              resize-vertical
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${error ? 'border-error' : 'border-gray-300'}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error
                ? `${textareaId}-error`
                : helperText
                ? `${textareaId}-helper`
                : showCounter
                ? `${textareaId}-counter`
                : undefined
            }
            {...props}
          />
          {showCounter && (
            <div
              id={`${textareaId}-counter`}
              className={`
                absolute bottom-2 right-2
                text-xs
                ${currentLength > maxLength * 0.9 ? 'text-warning' : 'text-gray-500'}
                ${currentLength >= maxLength ? 'text-error font-medium' : ''}
              `}
              aria-live="polite"
            >
              {currentLength} / {maxLength}
            </div>
          )}
        </div>
        {error && (
          <p id={`${textareaId}-error`} className="mt-1 text-sm text-error" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextAreaWithCounter.displayName = 'TextAreaWithCounter'
