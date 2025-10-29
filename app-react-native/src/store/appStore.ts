import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type InstrumentType = 'guitar' | 'ukulele';

interface AppState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  textScale: number;
  setTextScale: (scale: number) => void;
  instrument: InstrumentType;
  setInstrument: (i: InstrumentType) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      setThemeMode: (mode) => set({ themeMode: mode }),
      textScale: 1,
      setTextScale: (scale) => set({ textScale: Math.max(0.8, Math.min(1.6, scale)) }),
      instrument: 'guitar',
      setInstrument: (i) => set({ instrument: i }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode, textScale: state.textScale, instrument: state.instrument }),
    }
  )
);
