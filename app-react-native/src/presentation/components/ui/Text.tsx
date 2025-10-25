import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
  className?: string;
}

const variantClasses = {
  h1: 'text-4xl font-bold text-text-primary',
  h2: 'text-2xl font-bold text-text-primary',
  h3: 'text-xl font-semibold text-text-primary',
  body: 'text-base text-text-primary',
  caption: 'text-sm text-text-secondary',
  small: 'text-xs text-text-secondary',
};

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  className = '',
  children,
  ...props
}) => {
  return (
    <RNText className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </RNText>
  );
};
