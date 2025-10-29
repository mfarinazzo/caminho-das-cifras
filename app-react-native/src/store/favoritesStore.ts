import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesState {
  favorites: string[]; // Array de file paths dos cantos favoritos
  
  // Actions
  addFavorite: (file: string) => void;
  removeFavorite: (file: string) => void;
  toggleFavorite: (file: string) => void;
  isFavorite: (file: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (file: string) => {
        const { favorites } = get();
        if (!favorites.includes(file)) {
          set({ favorites: [...favorites, file] });
        }
      },

      removeFavorite: (file: string) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(f => f !== file) });
      },

      toggleFavorite: (file: string) => {
        const { favorites, addFavorite, removeFavorite } = get();
        if (favorites.includes(file)) {
          removeFavorite(file);
        } else {
          addFavorite(file);
        }
      },

      isFavorite: (file: string) => {
        const { favorites } = get();
        return favorites.includes(file);
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
