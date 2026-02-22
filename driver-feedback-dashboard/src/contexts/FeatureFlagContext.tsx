import React, { createContext, useContext, ReactNode } from 'react'
import { useFeatureFlags } from '../hooks/useFeatureFlags'
import type { FeatureFlagConfig } from '../types/api'
import { Spinner } from '../components'

interface FeatureFlagContextValue {
  config: FeatureFlagConfig | undefined
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | undefined>(undefined)

interface FeatureFlagProviderProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: (error: Error, retry: () => void) => ReactNode
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({
  children,
  fallback,
  errorFallback,
}) => {
  const { data: config, isLoading, error, refetch } = useFeatureFlags()

  // Show loading state
  if (isLoading) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Loading configuration...</p>
            </div>
          </div>
        )}
      </>
    )
  }

  // Show error state with retry
  if (error) {
    return (
      <>
        {errorFallback ? (
          errorFallback(error as Error, refetch)
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md">
              <div className="text-error mb-4">
                <svg
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Configuration Error
              </h2>
              <p className="text-gray-600 mb-6">
                {error instanceof Error ? error.message : 'Failed to load configuration'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  const value: FeatureFlagContextValue = {
    config,
    isLoading,
    error: error as Error | null,
    refetch,
  }

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  )
}

export function useFeatureFlagContext(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext)
  if (context === undefined) {
    throw new Error('useFeatureFlagContext must be used within a FeatureFlagProvider')
  }
  return context
}

// Helper hook to check if a specific feature is enabled
export function useIsFeatureEnabled(feature: keyof Omit<FeatureFlagConfig, 'alertThreshold'>): boolean {
  const { config } = useFeatureFlagContext()
  return config?.[feature] ?? false
}

// Helper hook to get alert threshold
export function useAlertThreshold(): number {
  const { config } = useFeatureFlagContext()
  return config?.alertThreshold ?? 2.5
}
