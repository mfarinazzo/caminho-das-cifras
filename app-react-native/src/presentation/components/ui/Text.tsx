import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useColorScheme } from 'react-native';
import { useAppStore } from '../../../store';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  className?: string;
}

const baseSizes = {
  h1: 32,
  h2: 24,
  h3: 20,
  body: 16,
  caption: 14,
  small: 12,
} as const;

const variantClasses = {
  h1: 'font-bold',
  h2: 'font-bold',
  h3: 'font-semibold',
  body: '',
  caption: '',
  small: '',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  className = '',
  children,
  style,
  ...props
}) => {
  const scheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const textScale = useAppStore((s) => s.textScale);
  const isDark = themeMode === 'system' ? scheme === 'dark' : themeMode === 'dark';

  const colorPrimary = isDark ? '#FFFFFF' : '#111827'; // gray-900
  const colorSecondary = isDark ? '#B3B3B3' : '#6B7280'; // gray-500
  const color = variant === 'caption' || variant === 'small' ? colorSecondary : colorPrimary;

  const fontSize = Math.round(baseSizes[variant] * textScale);
  const lineHeight = Math.round(fontSize * (variant === 'h1' ? 1.25 : variant === 'h2' ? 1.333 : variant === 'h3' ? 1.4 : 1.5));

  return (
    <RNText className={`${variantClasses[variant]} ${className}`} style={[{ color, fontSize, lineHeight }, style]} {...props}>
      {children}
    </RNText>
  );
};
