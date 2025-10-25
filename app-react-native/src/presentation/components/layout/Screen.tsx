import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const content = scrollable ? (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerClassName="pb-4"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={`flex-1 ${className}`}>{children}</View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      {content}
    </SafeAreaView>
  );
};
