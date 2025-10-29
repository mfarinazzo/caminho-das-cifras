import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../../store';
import { useColorScheme } from 'react-native';
import { useTheme as usePaperTheme } from 'react-native-paper';

interface ScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  scrollable = false,
  className = '',
}) => {
  const scheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const isDark = themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark';
  const paperTheme = usePaperTheme();

  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerStyle={{ paddingBottom: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: paperTheme.colors.background }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={paperTheme.colors.background} />
      {content}
    </SafeAreaView>
  );
};
