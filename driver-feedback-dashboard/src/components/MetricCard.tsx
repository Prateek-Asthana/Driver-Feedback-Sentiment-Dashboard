import React from 'react'
import { Card } from './Card'
import { Spinner } from './Spinner'

export interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  isLoading?: boolean
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  isLoading,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {isLoading ? (
            <div className="mt-2">
              <Spinner size="sm" />
            </div>
          ) : (
            <>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className="mt-2 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      trend.isPositive ? 'text-success' : 'text-error'
                    }`}
                  >
                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                  </span>
                  <span className="ml-2 text-sm text-gray-500">vs last period</span>
                </div>
              )}
            </>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="p-3 bg-primary bg-opacity-10 rounded-lg text-primary">
              {icon}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
