import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MediaItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster: string;
  season?: number;
  episode?: number;
  addedAt: number;
}

interface StreamStore {
  watchlist: MediaItem[];
  history: MediaItem[];
  addToWatchlist: (item: MediaItem) => void;
  removeFromWatchlist: (id: number) => void;
  addToHistory: (item: MediaItem) => void;
}

export const useStore = create<StreamStore>()(
  persist(
    (set) => ({
      watchlist: [],
      history: [],
      addToWatchlist: (item) => set((state) => {
        if (state.watchlist.some(m => m.id === item.id)) return state;
        return { watchlist: [...state.watchlist, item] };
      }),
      removeFromWatchlist: (id) => set((state) => ({
        watchlist: state.watchlist.filter(m => m.id !== id)
      })),
      addToHistory: (item) => set((state) => ({
        history: [item, ...state.history.filter(m => m.id !== item.id)].slice(0, 100)
      })),
    }),
    { name: 'streamflow-local-storage' }
  )
);
