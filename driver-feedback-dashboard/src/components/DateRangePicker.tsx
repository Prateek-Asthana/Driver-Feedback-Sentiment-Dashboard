import React from 'react'
import type { DateRangePreset } from '../types/api'

export interface DateRangePickerProps {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

const options: { value: DateRangePreset; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7days', label: 'Last 7 Days' },
  { value: '30days', label: 'Last 30 Days' },
]

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white">
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            px-4 py-2 text-sm font-medium transition-colors
            ${index === 0 ? 'rounded-l-lg' : ''}
            ${index === options.length - 1 ? 'rounded-r-lg' : ''}
            ${index > 0 ? 'border-l border-gray-300' : ''}
            ${
              value === option.value
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
