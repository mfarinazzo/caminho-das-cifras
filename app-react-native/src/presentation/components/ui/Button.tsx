import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ActivityIndicator,
} from 'react-native';
import { Text } from './Text';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  className?: string;
}

const variantClasses = {
  primary: 'bg-primary py-3 px-6 rounded-lg',
  secondary: 'bg-secondary py-3 px-6 rounded-lg',
  outline: 'border border-primary py-3 px-6 rounded-lg',
};

const textVariantClasses = {
  primary: 'text-background font-semibold text-center',
  secondary: 'text-background font-semibold text-center',
  outline: 'text-primary font-semibold text-center',
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`${variantClasses[variant]} ${className} ${
        disabled || loading ? 'opacity-50' : ''
      }`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#121212" />
      ) : (
        <Text className={textVariantClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
