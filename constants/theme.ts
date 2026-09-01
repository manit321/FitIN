import { Palette, Gradients } from './colors';
import { Spacing } from './spacing';
import { Typography } from './typography';

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,
} as const;

export const Shadows = {
  subtle: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 5,
  },
  glowPrimary: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
} as const;

export const Theme = {
  colors: Palette,
  gradients: Gradients,
  spacing: Spacing,
  typography: Typography,
  borderRadius: BorderRadius,
  shadows: Shadows,
};

export { Palette, Gradients, Spacing, Typography };
export default Theme;
