import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from './Card'
import { Spinner } from './Spinner'

export interface TagFrequencyBarChartProps {
  data: Record<string, number>
  isLoading?: boolean
}

export const TagFrequencyBarChart: React.FC<TagFrequencyBarChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="h-80 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Card>
    )
  }

  const chartData = Object.entries(data)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 tags

  if (chartData.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Feedback Tags
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No feedback tags available
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Top Feedback Tags
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis
            type="category"
            dataKey="tag"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '8px 12px',
            }}
            formatter={(value: number) => [value, 'Count']}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
