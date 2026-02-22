// Mock data for development without backend

import type {
  FeatureFlagConfig,
  OverviewMetrics,
  DriverListResponse,
  DriverAnalytics,
  FeedbackTimelineResponse,
  AlertsResponse,
} from '../types/api'

export const mockFeatureFlags: FeatureFlagConfig = {
  driverFeedback: true,
  tripFeedback: true,
  appFeedback: false,
  marshalFeedback: true,
  alertThreshold: 2.5,
}

export const mockOverviewMetrics: OverviewMetrics = {
  totalFeedback: 1247,
  sentimentDistribution: {
    positive: 68.5,
    neutral: 22.3,
    negative: 9.2,
  },
  averageScore: 4.1,
  flaggedDriverCount: 3,
}

export const mockDriverList: DriverListResponse = {
  drivers: [
    {
      id: 'DRV001',
      name: 'John Smith',
      totalTrips: 245,
      averageScore: 4.7,
      trend: { direction: 'up', percentage: 5 },
      isFlagged: false,
    },
    {
      id: 'DRV002',
      name: 'Sarah Johnson',
      totalTrips: 189,
      averageScore: 4.5,
      trend: { direction: 'stable', percentage: 0 },
      isFlagged: false,
    },
    {
      id: 'DRV003',
      name: 'Mike Davis',
      totalTrips: 312,
      averageScore: 3.2,
      trend: { direction: 'down', percentage: 8 },
      isFlagged: false,
    },
    {
      id: 'DRV004',
      name: 'Emily Brown',
      totalTrips: 156,
      averageScore: 2.1,
      trend: { direction: 'down', percentage: 15 },
      isFlagged: true,
    },
    {
      id: 'DRV005',
      name: 'David Wilson',
      totalTrips: 278,
      averageScore: 4.8,
      trend: { direction: 'up', percentage: 3 },
      isFlagged: false,
    },
  ],
  total: 5,
}

export const mockFeedbackTimeline: FeedbackTimelineResponse = {
  items: [
    {
      id: 'FB001',
      entityType: 'driver',
      entityName: 'John Smith',
      sentiment: 'positive',
      score: 5,
      comment: 'Excellent service, very professional driver!',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: 'FB002',
      entityType: 'trip',
      sentiment: 'neutral',
      score: 3,
      comment: 'Trip was okay, but there was some traffic delay.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'FB003',
      entityType: 'driver',
      entityName: 'Emily Brown',
      sentiment: 'negative',
      score: 2,
      comment: 'Driver was rude and drove recklessly.',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'FB004',
      entityType: 'marshal',
      entityName: 'Robert Lee',
      sentiment: 'positive',
      score: 5,
      comment: 'Very helpful and responsive marshal.',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ],
  total: 4,
  page: 1,
  pageSize: 20,
  hasMore: false,
}

export const mockAlerts: AlertsResponse = {
  alerts: [
    {
      id: 'ALT001',
      driverId: 'DRV004',
      driverName: 'Emily Brown',
      currentScore: 2.1,
      threshold: 2.5,
      triggeredAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: false,
    },
  ],
  unreadCount: 1,
}

export const mockDriverDetail: DriverAnalytics = {
  id: 'DRV001',
  name: 'John Smith',
  totalTrips: 245,
  averageScore: 4.7,
  isFlagged: false,
  scoreHistory: [
    { date: '2024-01-01', score: 4.5, feedbackCount: 12 },
    { date: '2024-01-08', score: 4.6, feedbackCount: 15 },
    { date: '2024-01-15', score: 4.7, feedbackCount: 18 },
    { date: '2024-01-22', score: 4.8, feedbackCount: 14 },
    { date: '2024-01-29', score: 4.7, feedbackCount: 16 },
  ],
  tagFrequency: {
    'Very Polite': 34,
    'Professional': 28,
    'Safe Driving': 42,
    'On Time': 38,
  },
  feedbackHistory: {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
  },
}
