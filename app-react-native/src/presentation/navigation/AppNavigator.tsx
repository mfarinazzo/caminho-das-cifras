import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme, Theme as NavTheme } from '@react-navigation/native';
import { useTheme as usePaperTheme } from 'react-native-paper';
import { BottomTabNavigator } from './BottomTabNavigator';

export const AppNavigator = () => {
  const paperTheme = usePaperTheme();
  const isDark = (paperTheme as any).dark ?? false;

  const navTheme: NavTheme = React.useMemo(() => ({
    ...(isDark ? DarkTheme : DefaultTheme),
    dark: isDark,
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: paperTheme.colors.primary,
      background: paperTheme.colors.background,
      card: paperTheme.colors.surface,
      text: (paperTheme.colors as any).onSurface || (isDark ? '#FFFFFF' : '#111827'),
      border: (paperTheme.colors as any).outline || (isDark ? '#333333' : '#E5E7EB'),
      notification: paperTheme.colors.error,
    },
  }), [isDark, paperTheme]);

  return (
    <NavigationContainer theme={navTheme}>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};
