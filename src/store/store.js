import { create } from 'zustand';

// Create a simple Zustand store to replace Zubridge
const useAppStore = create((set, get) => ({
	// Add your state properties here as needed
	// Example: someValue: null,
	
	// Add your actions here
	// Example: setSomeValue: (value) => set({ someValue: value }),
}));

// Export the store hook
export const useStore = useAppStore;

// Export empty actions object for compatibility
export const storeActions = {};
