import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  mockDrivers,
  mockFeedback,
  mockSentimentSummary,
  mockWeeklySentimentTrend,
  mockFeedbackTags,
  mockFeatureFlagConfig,
  mockDriverTrendData,
} from '../lib/mockData';

/**
 * API Service Layer
 * Currently uses mock data, but structure allows easy swap to real API endpoints
 * Uses React Query for caching and synchronization
 */

// Simulated API delay for realistic UX
const API_DELAY = 300; // ms

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * API Calls - Mock implementations
 */

export const apiService = {
  // Feature Flags
  async fetchFeatureFlags() {
    await delay(API_DELAY);
    return mockFeatureFlagConfig;
  },

  // Drivers
  async fetchDrivers() {
    await delay(API_DELAY);
    return mockDrivers;
  },

  async fetchDriver(driverId) {
    await delay(API_DELAY);
    const driver = mockDrivers.find((d) => d.id === driverId);
    if (!driver) throw new Error('Driver not found');
    return driver;
  },

  async searchDrivers(query) {
    await delay(API_DELAY);
    return mockDrivers.filter(
      (d) =>
        d.name.toLowerCase().includes(query.toLowerCase()) ||
        d.email.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Feedback
  async fetchFeedback(filters = {}) {
    await delay(API_DELAY);
    let results = [...mockFeedback];

    if (filters.driverId) {
      results = results.filter((f) => f.driverId === filters.driverId);
    }
    if (filters.sentiment) {
      results = results.filter((f) => f.sentiment === filters.sentiment);
    }
    if (filters.entity) {
      results = results.filter((f) => f.entity === filters.entity);
    }

    return results;
  },

  async submitFeedback(feedback) {
    await delay(API_DELAY);
    // In production, this would POST to backend
    return { success: true, id: Date.now(), ...feedback };
  },

  // Sentiment Data
  async fetchSentimentSummary(dateRange = 'week') {
    await delay(API_DELAY);
    return mockSentimentSummary[dateRange] || mockSentimentSummary.week;
  },

  async fetchWeeklySentimentTrend() {
    await delay(API_DELAY);
    return mockWeeklySentimentTrend;
  },

  async fetchDriverTrend(driverId) {
    await delay(API_DELAY);
    // In production, would fetch actual driver's trend data
    return mockDriverTrendData;
  },

  // Tags
  async fetchFeedbackTags(entity) {
    await delay(API_DELAY);
    return mockFeedbackTags[entity] || [];
  },

  // Alerts/Notifications
  async fetchAlerts() {
    await delay(API_DELAY);
    // Find drivers below threshold
    const driversBelow = mockDrivers.filter(
      (d) => d.isBelowThreshold
    );
    return driversBelow.map((d) => ({
      id: `alert-${d.id}`,
      type: 'warning',
      title: `Low Rating Alert: ${d.name}`,
      message: `${d.name}'s average score has dropped to ${d.averageScore}. Below threshold of ${d.alertThreshold}.`,
      driverId: d.id,
      timestamp: new Date(),
    }));
  },
};

/**
 * React Query Hooks - for data fetching with caching
 */

export const useFeatureFlags = () => {
  return useQuery({
    queryKey: ['featureFlags'],
    queryFn: () => apiService.fetchFeatureFlags(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useDrivers = () => {
  return useQuery({
    queryKey: ['drivers'],
    queryFn: () => apiService.fetchDrivers(),
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDriver = (driverId) => {
  return useQuery({
    queryKey: ['driver', driverId],
    queryFn: () => apiService.fetchDriver(driverId),
    enabled: !!driverId,
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 5,
  });
};

export const useFeedback = (filters = {}) => {
  return useQuery({
    queryKey: ['feedback', filters],
    queryFn: () => apiService.fetchFeedback(filters),
    staleTime: 1000 * 60 * 1, // 1 minute (updates frequently)
    cacheTime: 1000 * 60 * 5,
  });
};

export const useSentimentSummary = (dateRange = 'week') => {
  return useQuery({
    queryKey: ['sentimentSummary', dateRange],
    queryFn: () => apiService.fetchSentimentSummary(dateRange),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useWeeklySentimentTrend = () => {
  return useQuery({
    queryKey: ['weeklySentimentTrend'],
    queryFn: () => apiService.fetchWeeklySentimentTrend(),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useDriverTrend = (driverId) => {
  return useQuery({
    queryKey: ['driverTrend', driverId],
    queryFn: () => apiService.fetchDriverTrend(driverId),
    enabled: !!driverId,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export const useFeedbackTags = (entity) => {
  return useQuery({
    queryKey: ['feedbackTags', entity],
    queryFn: () => apiService.fetchFeedbackTags(entity),
    staleTime: 1000 * 60 * 60, // 1 hour (tags don't change often)
    cacheTime: 1000 * 60 * 60 * 24,
  });
};

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => apiService.fetchAlerts(),
    staleTime: 1000 * 60 * 1, // 1 minute (real-time alerts)
    cacheTime: 1000 * 60 * 5,
  });
};

// Mutations
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedback) => apiService.submitFeedback(feedback),
    onSuccess: () => {
      // Invalidate feedback cache after submission
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
    },
  });
};

export const useSearchDrivers = () => {
  return useQuery({
    queryKey: ['searchResults'],
    queryFn: ({ queryKey }) => apiService.searchDrivers(queryKey[1]),
    enabled: false,
  });
};
