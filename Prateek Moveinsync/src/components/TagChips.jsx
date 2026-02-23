import React from 'react';
import { X } from 'lucide-react';

/**
 * TagChips Component
 * Displays selectable tag chips for quick feedback
 * Used for multi-select feedback attributes
 */
const TagChips = ({
  tags = [],
  selectedTags = [],
  onTagSelect,
  onTagRemove,
  maxTags = 5,
  loading = false,
  error = null,
  label = 'Select Tags',
  required = false,
  multiSelect = true,
  disabled = false,
}) => {
  const canSelectMore = selectedTags.length < maxTags;

  const handleTagClick = (tag) => {
    if (disabled || loading) return;

    if (selectedTags.includes(tag)) {
      onTagRemove?.(tag);
    } else if (canSelectMore) {
      onTagSelect?.(tag);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-3">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
          {maxTags && (
            <span className="text-xs font-normal text-slate-500 ml-2">
              ({selectedTags.length}/{maxTags})
            </span>
          )}
        </label>
      )}

      {error && (
        <div className="mb-2 p-2 bg-danger/10 border border-danger/20 rounded text-danger text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-20 bg-slate-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 rounded-lg">
          <p className="text-slate-500 text-sm">No tags available</p>
        </div>
      ) : (
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                disabled={
                  disabled ||
                  loading ||
                  (!isSelected && !canSelectMore)
                }
                className={`
                  px-3 py-2 rounded-full text-sm font-medium transition-all
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    isSelected
                      ? 'bg-primary text-white shadow-md hover:shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
                type="button"
                aria-pressed={isSelected}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected tags display */}
      {multiSelect && selectedTags.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-semibold text-slate-600 mb-2">
            Selected:
          </p>
          <div className="flex gap-2 flex-wrap">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1"
              >
                <span className="text-sm text-primary font-medium">
                  {tag}
                </span>
                <button
                  onClick={() => onTagRemove?.(tag)}
                  className="text-primary hover:text-primary/70 focus:outline-none"
                  aria-label={`Remove ${tag}`}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagChips;
