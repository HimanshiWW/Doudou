import { create } from 'zustand';

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  location_type: string;
  privacy_level: string;
  requires_purchase: boolean;
  description?: string;
  amenities: string[];
  photos: string[];
  owner_id?: string;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  verified: boolean;
}

export interface Review {
  id: string;
  location_id: string;
  staff_rating: number;
  comfort_rating: number;
  privacy_rating: number;
  safety_rating: number;
  overall_rating: number;
  would_return: boolean;
  comment?: string;
  issues: string[];
  photos: string[];
  anonymous: boolean;
  reviewer_name?: string;
  helpful_count: number;
  created_at: string;
}

export interface Filters {
  location_type?: string;
  privacy_level?: string;
  free_only: boolean;
  verified_only: boolean;
  distance_km: number;
}

interface LocationsStore {
  locations: Location[];
  savedLocations: Location[];
  currentLocation: Location | null;
  reviews: Review[];
  filters: Filters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchLocations: () => Promise<void>;
  fetchSavedLocations: () => Promise<void>;
  fetchLocationById: (id: string) => Promise<void>;
  fetchReviews: (locationId: string) => Promise<void>;
  addLocation: (location: Omit<Location, 'id' | 'average_rating' | 'total_reviews' | 'created_at' | 'verified'>) => Promise<boolean>;
  addReview: (review: Omit<Review, 'id' | 'overall_rating' | 'helpful_count' | 'created_at'>) => Promise<boolean>;
  saveLocation: (locationId: string) => Promise<void>;
  unsaveLocation: (locationId: string) => Promise<void>;
  checkIfSaved: (locationId: string) => Promise<boolean>;
  setFilters: (filters: Partial<Filters>) => void;
  clearFilters: () => void;
  seedData: () => Promise<void>;
}

const defaultFilters: Filters = {
  location_type: undefined,
  privacy_level: undefined,
  free_only: false,
  verified_only: false,
  distance_km: 5,
};

export const useLocationsStore = create<LocationsStore>((set, get) => ({
  locations: [],
  savedLocations: [],
  currentLocation: null,
  reviews: [],
  filters: defaultFilters,
  isLoading: false,
  error: null,

  fetchLocations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const params = new URLSearchParams();
      
      if (filters.location_type) params.append('location_type', filters.location_type);
      if (filters.privacy_level) params.append('privacy_level', filters.privacy_level);
      if (filters.free_only) params.append('free_only', 'true');
      if (filters.verified_only) params.append('verified_only', 'true');
      
      const response = await fetch(`${API_URL}/api/locations?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      
      const data = await response.json();
      set({ locations: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching locations:', error);
      set({ error: 'Failed to load locations', isLoading: false });
    }
  },

  fetchSavedLocations: async () => {
    try {
      const response = await fetch(`${API_URL}/api/saved`);
      if (!response.ok) throw new Error('Failed to fetch saved locations');
      
      const data = await response.json();
      set({ savedLocations: data });
    } catch (error) {
      console.error('Error fetching saved locations:', error);
    }
  },

  fetchLocationById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/locations/${id}`);
      if (!response.ok) throw new Error('Location not found');
      
      const data = await response.json();
      set({ currentLocation: data, isLoading: false });
    } catch (error) {
      console.error('Error fetching location:', error);
      set({ error: 'Location not found', isLoading: false, currentLocation: null });
    }
  },

  fetchReviews: async (locationId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${locationId}`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      set({ reviews: data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      set({ reviews: [] });
    }
  },

  addLocation: async (location) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(location),
      });
      
      if (!response.ok) throw new Error('Failed to add location');
      
      // Refresh locations list
      await get().fetchLocations();
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error adding location:', error);
      set({ error: 'Failed to add location', isLoading: false });
      return false;
    }
  },

  addReview: async (review) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      
      if (!response.ok) throw new Error('Failed to add review');
      
      // Refresh reviews
      await get().fetchReviews(review.location_id);
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      set({ error: 'Failed to add review', isLoading: false });
      return false;
    }
  },

  saveLocation: async (locationId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/saved`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location_id: locationId }),
      });
      
      if (response.ok) {
        await get().fetchSavedLocations();
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  },

  unsaveLocation: async (locationId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/saved/${locationId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await get().fetchSavedLocations();
      }
    } catch (error) {
      console.error('Error unsaving location:', error);
    }
  },

  checkIfSaved: async (locationId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/saved/check/${locationId}`);
      if (response.ok) {
        const data = await response.json();
        return data.saved;
      }
      return false;
    } catch (error) {
      console.error('Error checking if saved:', error);
      return false;
    }
  },

  setFilters: (filters: Partial<Filters>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearFilters: () => {
    set({ filters: defaultFilters });
  },

  seedData: async () => {
    try {
      const response = await fetch(`${API_URL}/api/seed`, {
        method: 'POST',
      });
      
      if (response.ok) {
        await get().fetchLocations();
      }
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  },
}));
