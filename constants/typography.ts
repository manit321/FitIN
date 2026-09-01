import { Platform } from 'react-native';

/**
 * APEXFIT Design System - Typography Tokens
 * 
 * Native iOS San Francisco type scale with clear hierarchy.
 */

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
  lineHeights: {
    caption: 16,
    subhead: 20,
    body: 22,
    title3: 26,
    title2: 30,
    title1: 34,
  },
} as const;

export type TypographySize = keyof typeof Typography.fontSizes;
