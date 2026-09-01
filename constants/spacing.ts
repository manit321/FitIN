/**
 * APEXFIT Design System - Spacing Tokens
 * 
 * Multiples of 4 and 8 for a consistent mathematical grid across all screen sizes.
 */

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 44,
} as const;

export type SpacingKey = keyof typeof Spacing;
