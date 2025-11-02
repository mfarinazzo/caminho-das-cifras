import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';
export type InstrumentType = 'guitar' | 'ukulele' | 'charango';

interface AppState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  textScale: number;
  setTextScale: (scale: number) => void;
  instrument: InstrumentType;
  setInstrument: (i: InstrumentType) => void;
  // per-song capo mapping (file path -> fret number)
  capoBySong: Record<string, number>;
  setCapoForSong: (file: string, fret: number) => void;
  clearCapoForSong: (file: string) => void;
  // per-song transpose mapping (file path -> semitone offset)
  transposeBySong: Record<string, number>;
  setTransposeForSong: (file: string, semitones: number) => void;
  clearTransposeForSong: (file: string) => void;
  // per-song annotations
  notesBySong: Record<string, string>;
  setNoteForSong: (file: string, note: string) => void;
  clearNoteForSong: (file: string) => void;
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
      // capo state
      capoBySong: {},
      setCapoForSong: (file, fret) =>
        set((state) => ({
          capoBySong: {
            ...state.capoBySong,
            [file]: Math.max(0, Math.min(12, Math.floor(fret || 0))),
          },
        })),
      clearCapoForSong: (file) =>
        set((state) => {
          const next = { ...state.capoBySong };
          delete next[file];
          return { capoBySong: next } as Partial<AppState> as any;
        }),
      // transpose state
      transposeBySong: {},
      setTransposeForSong: (file, semitones) =>
        set((state) => ({
          transposeBySong: {
            ...state.transposeBySong,
            [file]: ((semitones % 12) + 12) % 12, // normalize to 0..11
          },
        })),
      clearTransposeForSong: (file) =>
        set((state) => {
          const next = { ...state.transposeBySong };
          delete next[file];
          return { transposeBySong: next } as Partial<AppState> as any;
        }),
      // annotations
      notesBySong: {},
      setNoteForSong: (file, note) =>
        set((state) => ({
          notesBySong: { ...state.notesBySong, [file]: (note || '').slice(0, 150) },
        })),
      clearNoteForSong: (file) =>
        set((state) => {
          const next = { ...state.notesBySong };
          delete next[file];
          return { notesBySong: next } as Partial<AppState> as any;
        }),
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
        textScale: state.textScale,
        instrument: state.instrument,
        capoBySong: state.capoBySong,
        transposeBySong: state.transposeBySong,
        notesBySong: state.notesBySong,
      }),
    }
  )
);
