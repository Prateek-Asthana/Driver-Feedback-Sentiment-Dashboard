import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Stack, Button, Badge, TrendLineChart, TagFrequencyBarChart, Spinner } from '../components'
import { useDriverDetail } from '../hooks'

export const DriverDetailPage: React.FC = () => {
  const { driverId } = useParams<{ driverId: string }>()
  const navigate = useNavigate()
  const { data: driver, isLoading } = useDriverDetail(driverId)

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!driver) {
    return (
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Driver Not Found</h2>
          <p className="text-gray-600 mb-4">The requested driver could not be found.</p>
          <Button onClick={() => navigate('/dashboard/drivers')}>
            Back to Drivers
          </Button>
        </div>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-success'
    if (score >= 2.5) return 'text-warning'
    return 'text-error'
  }

  return (
    <Stack spacing={6}>
      <div>
        <Button variant="ghost" onClick={() => navigate('/dashboard/drivers')} className="mb-4">
          ← Back to Drivers
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{driver.name}</h1>
              {driver.isFlagged && <Badge variant="error">Flagged</Badge>}
            </div>
            <p className="text-gray-600">Driver ID: {driver.id}</p>
          </div>
          
          <Card padding="md" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Average Score</p>
              <p className={`text-4xl font-bold ${getScoreColor(driver.averageScore)}`}>
                {driver.averageScore.toFixed(2)}
              </p>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(driver.averageScore) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Trips</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{driver.totalTrips}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Feedback Count</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {driver.scoreHistory.reduce((sum, point) => sum + point.feedbackCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {driver.isFlagged ? 'Needs Attention' : 'Good Standing'}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${driver.isFlagged ? 'bg-red-100' : 'bg-green-100'}`}>
              <svg className={`h-8 w-8 ${driver.isFlagged ? 'text-red-600' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {driver.isFlagged ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>
          </div>
        </Card>
      </div>

      <TrendLineChart data={driver.scoreHistory} />

      <TagFrequencyBarChart data={driver.tagFrequency} />
    </Stack>
  )
}
