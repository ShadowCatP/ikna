import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

function applyColorScheme(mode: ThemeMode) {
  if (Platform.OS === 'web') return;
  Appearance.setColorScheme(mode === 'system' ? 'unspecified' : mode);
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        applyColorScheme(mode);
        set({ mode });
      },
    }),
    {
      name: 'theme-mode',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) applyColorScheme(state.mode);
      },
    }
  )
);
