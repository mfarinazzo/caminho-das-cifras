import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';

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

  return (
    <Wrapper
      className={`bg-background-card rounded-xl p-4 ${className}`}
      onPress={onPress}
    >
      {children}
    </Wrapper>
  );
};
