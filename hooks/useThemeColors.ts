import { Palette } from '../constants/colors';

export function useThemeColors() {
  return {
    colors: Palette,
    isDark: false,
    themeMode: 'light' as const,
  };
}
