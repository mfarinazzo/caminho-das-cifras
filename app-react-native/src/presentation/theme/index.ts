export const colors = {
  background: {
    DEFAULT: '#121212',
    elevated: '#1E1E1E',
    card: '#2A2A2A',
  },
  surface: {
    DEFAULT: '#1E1E1E',
    elevated: '#2A2A2A',
  },
  primary: {
    DEFAULT: '#90CAF9',
    light: '#B3E5FC',
    dark: '#64B5F6',
  },
  secondary: {
    DEFAULT: '#CE93D8',
    light: '#E1BEE7',
    dark: '#BA68C8',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    disabled: '#666666',
  },
  divider: '#3A3A3A',
  error: '#CF6679',
  success: '#81C784',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
} as const;
