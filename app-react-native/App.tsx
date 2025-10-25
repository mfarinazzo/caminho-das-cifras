import React from 'react';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { AppNavigator } from './src/presentation/navigation/AppNavigator';

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90CAF9',
    secondary: '#CE93D8',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2A2A2A',
    error: '#CF6679',
  },
};

export default function App() {
  return (
    <PaperProvider theme={darkTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}
