import React, { useState } from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import type { DriverData } from '../types/api'

export interface SortableTableProps {
  drivers: DriverData[]
  onDriverClick: (driverId: string) => void
  isLoading?: boolean
}

export const SortableTable: React.FC<SortableTableProps> = ({
  drivers,
  onDriverClick,
  isLoading,
}) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [sortColumn, setSortColumn] = useState<'name' | 'averageScore' | 'totalTrips'>('averageScore')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('desc')
    }
  }

  const sortedDrivers = [...drivers].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1
    if (sortColumn === 'name') {
      return multiplier * a.name.localeCompare(b.name)
    }
    return multiplier * (a[sortColumn] - b[sortColumn])
  })

  const getRowColor = (score: number) => {
    if (score >= 4.0) return 'bg-green-50'
    if (score >= 2.5) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  const getSortIcon = (column: typeof sortColumn) => {
    if (sortColumn !== column) {
      return (
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return sortOrder === 'asc' ? (
      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Driver
                  {getSortIcon('name')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('totalTrips')}
              >
                <div className="flex items-center gap-2">
                  Total Trips
                  {getSortIcon('totalTrips')}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('averageScore')}
              >
                <div className="flex items-center gap-2">
                  Avg Score
                  {getSortIcon('averageScore')}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDrivers.map((driver) => (
              <React.Fragment key={driver.id}>
                <tr
                  className={`${getRowColor(driver.averageScore)} hover:opacity-75 cursor-pointer transition-opacity`}
                  onClick={() => setExpandedRow(expandedRow === driver.id ? null : driver.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{driver.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{driver.totalTrips}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {driver.averageScore.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm">
                      {driver.trend.direction === 'up' ? (
                        <span className="text-success">↑ {driver.trend.percentage}%</span>
                      ) : driver.trend.direction === 'down' ? (
                        <span className="text-error">↓ {driver.trend.percentage}%</span>
                      ) : (
                        <span className="text-gray-500">→ 0%</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {driver.isFlagged && <Badge variant="error">Flagged</Badge>}
                  </td>
                </tr>
                {expandedRow === driver.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 bg-gray-50">
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-2">Recent Feedback (Last 5)</p>
                        <p className="text-gray-500">Feedback details coming soon...</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDriverClick(driver.id)
                          }}
                          className="mt-2 text-primary hover:text-primary-hover font-medium"
                        >
                          View Full Details →
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
