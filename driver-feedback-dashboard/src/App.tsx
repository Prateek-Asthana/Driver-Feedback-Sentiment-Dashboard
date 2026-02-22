import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { FeatureFlagProvider } from './contexts'
import { DashboardLayout, Spinner, ErrorBoundary } from './components'
import { useMarkAlertAsRead } from './hooks'

// Lazy load pages for code splitting
const FeedbackFormPage = lazy(() => import('./pages/FeedbackFormPage').then(m => ({ default: m.FeedbackFormPage })))
const DashboardOverviewPage = lazy(() => import('./pages/DashboardOverviewPage').then(m => ({ default: m.DashboardOverviewPage })))
const DriverLeaderboardPage = lazy(() => import('./pages/DriverLeaderboardPage').then(m => ({ default: m.DriverLeaderboardPage })))
const FeedbackTimelinePage = lazy(() => import('./pages/FeedbackTimelinePage').then(m => ({ default: m.FeedbackTimelinePage })))
const DriverDetailPage = lazy(() => import('./pages/DriverDetailPage').then(m => ({ default: m.DriverDetailPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 3,
    },
  },
})

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
)

function DashboardRoutes() {
  const navigate = useNavigate()
  const { mutate: markAsRead } = useMarkAlertAsRead()

  const handleAlertClick = (alertId: string) => {
    markAsRead(alertId)
    navigate('/dashboard/drivers')
  }

  return (
    <DashboardLayout onAlertClick={handleAlertClick}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<DashboardOverviewPage />} />
          <Route path="/drivers" element={<DriverLeaderboardPage />} />
          <Route path="/drivers/:driverId" element={<DriverDetailPage />} />
          <Route path="/timeline" element={<FeedbackTimelinePage />} />
        </Routes>
      </Suspense>
    </DashboardLayout>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <FeatureFlagProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Navigate to="/feedback" replace />} />
                <Route path="/feedback" element={<FeedbackFormPage />} />
                <Route path="/dashboard/*" element={<DashboardRoutes />} />
              </Routes>
            </Suspense>
          </FeatureFlagProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
