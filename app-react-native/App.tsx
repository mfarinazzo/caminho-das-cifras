import React from 'react';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';
import { useColorScheme } from 'react-native';
import { useAppStore } from './src/store';

const buildTheme = (isDark: boolean) => ({
  ...(isDark ? MD3DarkTheme : MD3LightTheme),
  colors: {
    ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
    primary: '#90CAF9',
    secondary: '#CE93D8',
    background: isDark ? '#121212' : '#FFFFFF',
    surface: isDark ? '#1E1E1E' : '#FFFFFF',
    surfaceVariant: isDark ? '#2A2A2A' : '#F4F4F5',
    error: '#CF6679',
  },
});

export default function App() {
  const scheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const isDark = themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark';
  const theme = React.useMemo(() => buildTheme(isDark), [isDark]);

  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
    </PaperProvider>
  );
}
