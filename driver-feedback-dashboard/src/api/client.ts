// API Client with error handling and request interceptors

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || true // Default to mock data

// Import mock data
import {
  mockFeatureFlags,
  mockOverviewMetrics,
  mockDriverList,
  mockFeedbackTimeline,
  mockAlerts,
  mockDriverDetail,
} from './mockData'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

async function request<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  // Return mock data if enabled
  if (USE_MOCK_DATA) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockData(endpoint) as T)
      }, 500) // Simulate network delay
    })
  }

  const { params, headers, ...restConfig } = config

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Add authentication token if available
  const token = localStorage.getItem('auth_token')
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...restConfig,
      headers: requestHeaders,
    })

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      const errorData = isJson ? await response.json() : await response.text()
      
      // Map status codes to user-friendly messages
      const errorMessage = getErrorMessage(response.status, errorData)
      
      throw new ApiError(errorMessage, response.status, errorData)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return {} as T
    }

    return (isJson ? await response.json() : await response.text()) as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Network errors or other fetch failures
    if (error instanceof TypeError) {
      throw new ApiError(
        'Network error. Please check your internet connection.',
        0,
        error
      )
    }

    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      0,
      error
    )
  }
}

function getErrorMessage(status: number, data: unknown): string {
  // Try to extract message from error response
  if (data && typeof data === 'object' && 'message' in data) {
    return String(data.message)
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.'
    case 401:
      return 'Authentication required. Please log in.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 404:
      return 'The requested resource was not found.'
    case 409:
      return 'This action conflicts with existing data.'
    case 422:
      return 'Validation error. Please check your input.'
    case 429:
      return 'Too many requests. Please try again later.'
    case 500:
      return 'Server error. Please try again later.'
    case 503:
      return 'Service temporarily unavailable. Please try again later.'
    default:
      return `Request failed with status ${status}`
  }
}

// Mock data router
function getMockData(endpoint: string): unknown {
  if (endpoint.includes('/config/feature-flags')) {
    return mockFeatureFlags
  }
  if (endpoint.includes('/dashboard/overview')) {
    return mockOverviewMetrics
  }
  if (endpoint.includes('/dashboard/drivers') && !endpoint.includes('/dashboard/drivers/')) {
    return mockDriverList
  }
  if (endpoint.includes('/dashboard/drivers/')) {
    return mockDriverDetail
  }
  if (endpoint.includes('/dashboard/feedback')) {
    return mockFeedbackTimeline
  }
  if (endpoint.includes('/dashboard/alerts')) {
    return mockAlerts
  }
  if (endpoint.includes('/feedback')) {
    return { id: 'FB_NEW', submittedAt: new Date().toISOString(), status: 'success' }
  }
  return {}
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: 'DELETE' }),
}
