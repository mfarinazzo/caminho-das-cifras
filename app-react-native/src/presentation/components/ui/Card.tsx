import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { useAppStore } from '../../../store';
import { useColorScheme } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  className = '',
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  const scheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const isDark = themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark';

  const bg = isDark ? '#2A2A2A' : '#FFFFFF';
  const borderStyle = isDark
    ? {}
    : { borderWidth: 1, borderColor: '#E5E7EB' };

  return (
    <Wrapper
      className={`rounded-xl p-4 ${className}`}
      style={[{ backgroundColor: bg }, borderStyle]}
      onPress={onPress}
    >
      {children}
    </Wrapper>
  );
};
