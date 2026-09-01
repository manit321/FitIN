import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useFitness } from '../context/FitnessContext';
import { DarkPalette, LightPalette } from '../constants/colors';

export function useThemeColors() {
  const { settings } = useFitness();
  const systemScheme = useSystemColorScheme();

  const themeMode = settings?.theme || 'dark';

  const isDark =
    themeMode === 'dark'
      ? true
      : themeMode === 'light'
      ? false
      : systemScheme === 'dark';

  const colors = isDark ? DarkPalette : LightPalette;

  return {
    colors,
    isDark,
    themeMode,
  };
}
