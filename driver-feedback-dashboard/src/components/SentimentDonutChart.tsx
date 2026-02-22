import React, { memo, useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Card } from './Card'
import { Spinner } from './Spinner'

export interface SentimentDonutChartProps {
  data: {
    positive: number
    neutral: number
    negative: number
  }
  isLoading?: boolean
}

const COLORS = {
  positive: '#059669',
  neutral: '#d97706',
  negative: '#dc2626',
}

export const SentimentDonutChart: React.FC<SentimentDonutChartProps> = memo(({
  data,
  isLoading,
}) => {
  const chartData = useMemo(() => [
    { name: 'Positive', value: data.positive, color: COLORS.positive },
    { name: 'Neutral', value: data.neutral, color: COLORS.neutral },
    { name: 'Negative', value: data.negative, color: COLORS.negative },
  ], [data])

  if (isLoading) {
    return (
      <Card>
        <div className="h-80 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sentiment Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
})

SentimentDonutChart.displayName = 'SentimentDonutChart'
