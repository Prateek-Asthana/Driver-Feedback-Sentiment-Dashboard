import { create } from 'zustand';

// Simple frontend-only auth store for demo purposes
export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useAuthStore;
