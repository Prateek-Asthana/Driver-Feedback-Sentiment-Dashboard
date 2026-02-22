import React from 'react'

export interface TagChipGroupProps {
  tags: string[]
  selectedTags: string[]
  onChange: (tags: string[]) => void
  disabled?: boolean
  label?: string
  error?: string
}

export const TagChipGroup: React.FC<TagChipGroupProps> = ({
  tags,
  selectedTags,
  onChange,
  disabled = false,
  label,
  error,
}) => {
  const toggleTag = (tag: string) => {
    if (disabled) return

    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter((t) => t !== tag))
    } else {
      onChange([...selectedTags, tag])
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, tag: string) => {
    if (disabled) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleTag(tag)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div
        role="group"
        aria-label={label || 'Tag selection'}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'tag-group-error' : undefined}
        className="flex flex-wrap gap-2"
      >
        {tags.map((tag) => {
          const isSelected = selectedTags.includes(tag)

          return (
            <button
              key={tag}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              aria-label={tag}
              disabled={disabled}
              onClick={() => toggleTag(tag)}
              onKeyDown={(e) => handleKeyDown(e, tag)}
              className={`
                px-4 py-2 min-h-[44px]
                rounded-full text-sm font-medium
                transition-all duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${
                  isSelected
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {tag}
            </button>
          )
        })}
      </div>
      {error && (
        <p id="tag-group-error" className="text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
