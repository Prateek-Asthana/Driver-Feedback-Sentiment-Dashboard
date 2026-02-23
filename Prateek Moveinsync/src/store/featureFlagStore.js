import { create } from 'zustand';

/**
 * Global feature flag store using Zustand
 * Manages which feedback entities are enabled/disabled
 * Can be updated from API responses without page reload
 */
export const useFeatureFlagStore = create((set) => ({
  // Feature flags configuration
  featureFlags: {
    driverFeedback: true,
    tripFeedback: true,
    appFeedback: false,
    marshalFeedback: false,
  },

  // Update single flag
  setFeatureFlag: (flagName, value) =>
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        [flagName]: value,
      },
    })),

  // Update multiple flags at once (from API config)
  setFeatureFlags: (flags) =>
    set((state) => ({
      featureFlags: {
        ...state.featureFlags,
        ...flags,
      },
    })),

  // Get list of enabled feedback entities
  getEnabledFeedbackTypes: () =>
    Object.entries(useFeatureFlagStore.getState().featureFlags)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => key.replace('Feedback', '')),

  // Check if any feedback type is enabled
  hasAnyFeedbackEnabled: () =>
    Object.values(useFeatureFlagStore.getState().featureFlags).some(
      (enabled) => enabled
    ),

  // Reset to defaults
  resetFlags: () =>
    set({
      featureFlags: {
        driverFeedback: true,
        tripFeedback: true,
        appFeedback: false,
        marshalFeedback: false,
      },
    }),
}));
