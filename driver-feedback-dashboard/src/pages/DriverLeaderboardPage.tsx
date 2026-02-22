import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Stack, SearchBar, SortableTable, DateRangePicker } from '../components'
import { useDriverList } from '../hooks'
import type { DateRangePreset } from '../types/api'

export const DriverLeaderboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [dateRange, setDateRange] = useState<DateRangePreset>('7days')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useDriverList({ dateRange, search })

  const handleDriverClick = (driverId: string) => {
    navigate(`/dashboard/drivers/${driverId}`)
  }

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Leaderboard</h1>
          <p className="mt-2 text-gray-600">View and sort driver performance data</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by driver name or ID..."
          />
        </div>
        <div className="text-sm text-gray-600">
          {data?.total ?? 0} drivers
        </div>
      </div>

      <SortableTable
        drivers={data?.drivers ?? []}
        onDriverClick={handleDriverClick}
        isLoading={isLoading}
      />
    </Stack>
  )
}
