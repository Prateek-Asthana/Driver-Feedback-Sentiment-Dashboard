import React from 'react'
import type { EntityType, SentimentType } from '../types/api'

export interface FilterPanelProps {
  entityType?: EntityType
  sentiment?: SentimentType
  onEntityTypeChange: (type: EntityType | undefined) => void
  onSentimentChange: (sentiment: SentimentType | undefined) => void
}

const entityOptions: { value: EntityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'driver', label: 'Driver' },
  { value: 'trip', label: 'Trip' },
  { value: 'app', label: 'App' },
  { value: 'marshal', label: 'Marshal' },
]

const sentimentOptions: { value: SentimentType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Sentiments' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'negative', label: 'Negative' },
]

export const FilterPanel: React.FC<FilterPanelProps> = ({
  entityType,
  sentiment,
  onEntityTypeChange,
  onSentimentChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label htmlFor="entity-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Entity Type
        </label>
        <select
          id="entity-filter"
          value={entityType || 'all'}
          onChange={(e) =>
            onEntityTypeChange(e.target.value === 'all' ? undefined : (e.target.value as EntityType))
          }
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg"
        >
          {entityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sentiment-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Sentiment
        </label>
        <select
          id="sentiment-filter"
          value={sentiment || 'all'}
          onChange={(e) =>
            onSentimentChange(e.target.value === 'all' ? undefined : (e.target.value as SentimentType))
          }
          className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg"
        >
          {sentimentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
