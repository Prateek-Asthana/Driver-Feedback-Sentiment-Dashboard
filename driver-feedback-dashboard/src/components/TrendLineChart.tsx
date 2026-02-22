import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from './Card'
import { Spinner } from './Spinner'
import type { ScoreDataPoint } from '../types/api'

export interface TrendLineChartProps {
  data: ScoreDataPoint[]
  isLoading?: boolean
}

export const TrendLineChart: React.FC<TrendLineChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="h-80 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Card>
    )
  }

  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: point.score,
    feedbackCount: point.feedbackCount,
  }))

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        30-Day Score Trend
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[0, 1, 2, 3, 4, 5]}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '8px 12px',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'score') return [value.toFixed(2), 'Score']
              return [value, 'Feedback Count']
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
