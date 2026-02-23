import { create } from 'zustand';

/**
 * Global app state store using Zustand
 * Manages dashboard filters, selections, and UI state
 */
export const useAppStore = create((set) => ({
  // Dashboard state
  selectedDriver: null,
  dateRange: 'week', // 'today', 'week', 'month', 'year'
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'rating', // 'rating', 'name', 'trend'
  sortOrder: 'desc', // 'asc', 'desc'

  // Alert state
  alerts: [],
  readAlertIds: new Set(),

  // Pagination state
  currentPage: 1,
  pageSize: 10,

  // Filters
  sentimentFilter: null, // 'positive', 'negative', 'neutral', null (all)
  ratingFilter: { min: 0, max: 5 }, // score range

  // Actions
  setSelectedDriver: (driver) => set({ selectedDriver: driver }),
  setDateRange: (range) => set({ dateRange: range }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (field, order) =>
    set({ sortBy: field, sortOrder: order }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setSentimentFilter: (sentiment) => set({ sentimentFilter: sentiment }),
  setRatingFilter: (min, max) =>
    set({ ratingFilter: { min, max } }),

  // Alert management
  addAlert: (alert) =>
    set((state) => ({
      alerts: [{ id: Date.now(), ...alert }, ...state.alerts],
    })),

  removeAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    })),

  markAlertAsRead: (alertId) =>
    set((state) => ({
      readAlertIds: new Set([...state.readAlertIds, alertId]),
    })),

  getUnreadAlertCount: () => {
    const state = useAppStore.getState();
    return state.alerts.filter((a) => !state.readAlertIds.has(a.id)).length;
  },

  // Reset filters
  resetFilters: () =>
    set({
      selectedDriver: null,
      dateRange: 'week',
      selectedCategory: 'all',
      searchQuery: '',
      sortBy: 'rating',
      sortOrder: 'desc',
      sentimentFilter: null,
      ratingFilter: { min: 0, max: 5 },
      currentPage: 1,
    }),
}));
