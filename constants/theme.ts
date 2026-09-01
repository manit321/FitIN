import { Platform } from 'react-native';
import { Palette } from './colors';

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const Typography = {
  fontFamilies: {
    regular: Platform.select({ ios: 'System', default: 'sans-serif' }),
    medium: Platform.select({ ios: 'System', default: 'sans-serif-medium' }),
    bold: Platform.select({ ios: 'System', default: 'sans-serif' }),
  },
  fontSizes: {
    micro: 10,
    caption: 12,
    subhead: 14,
    body: 16,
    headline: 17,
    title3: 20,
    title2: 24,
    title1: 28,
    display: 34,
    giant: 44,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
};

export const Shadows = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 8,
  },
  glowPrimary: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
};
