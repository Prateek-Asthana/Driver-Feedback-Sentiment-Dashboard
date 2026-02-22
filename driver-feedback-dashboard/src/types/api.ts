// API Type Definitions

export interface FeatureFlagConfig {
  driverFeedback: boolean
  tripFeedback: boolean
  appFeedback: boolean
  marshalFeedback: boolean
  alertThreshold: number
}

export interface FeedbackSubmissionPayload {
  employeeId: string
  tripId: string
  entities: {
    driver?: {
      driverId: string
      rating: number
      tags: string[]
      comment?: string
    }
    trip?: {
      rating: number
      tags: string[]
      comment?: string
    }
    app?: {
      rating: number
      tags: string[]
      comment?: string
    }
    marshal?: {
      marshalId: string
      rating: number
      tags: string[]
      comment?: string
    }
  }
}

export interface FeedbackSubmissionResponse {
  id: string
  submittedAt: string
  status: 'success'
}

export interface OverviewMetrics {
  totalFeedback: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  averageScore: number
  flaggedDriverCount: number
}

export interface DriverData {
  id: string
  name: string
  totalTrips: number
  averageScore: number
  trend: {
    direction: 'up' | 'down' | 'stable'
    percentage: number
  }
  isFlagged: boolean
}

export interface DriverListResponse {
  drivers: DriverData[]
  total: number
}

export interface ScoreDataPoint {
  date: string
  score: number
  feedbackCount: number
}

export interface FeedbackEntry {
  id: string
  rating: number
  tags: string[]
  comment?: string
  timestamp: string
}

export interface DriverAnalytics {
  id: string
  name: string
  totalTrips: number
  averageScore: number
  isFlagged: boolean
  scoreHistory: ScoreDataPoint[]
  tagFrequency: Record<string, number>
  feedbackHistory: {
    items: FeedbackEntry[]
    total: number
    page: number
    pageSize: number
  }
}

export interface TimelineFeedbackEntry {
  id: string
  entityType: 'driver' | 'trip' | 'app' | 'marshal'
  entityName?: string
  sentiment: 'positive' | 'neutral' | 'negative'
  score: number
  comment?: string
  timestamp: string
}

export interface FeedbackTimelineResponse {
  items: TimelineFeedbackEntry[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface Alert {
  id: string
  driverId: string
  driverName: string
  currentScore: number
  threshold: number
  triggeredAt: string
  isRead: boolean
}

export interface AlertsResponse {
  alerts: Alert[]
  unreadCount: number
}

export type DateRangePreset = 'today' | '7days' | '30days'

export type SortColumn = 'name' | 'averageScore' | 'totalTrips'
export type SortOrder = 'asc' | 'desc'

export type EntityType = 'driver' | 'trip' | 'app' | 'marshal'
export type SentimentType = 'positive' | 'neutral' | 'negative'
