import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { BorderRadius, Spacing, Shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'highlight' | 'glass' | 'danger';
  onPress?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
  disabled = false,
}) => {
  const { colors, isDark } = useThemeColors();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.bgCardElevated,
          borderColor: colors.borderDefault,
          ...Shadows.card,
        };
      case 'highlight':
        return {
          backgroundColor: colors.bgCardElevated,
          borderColor: colors.borderHighlight,
          ...Shadows.glowPrimary,
        };
      case 'glass':
        return {
          backgroundColor: isDark ? 'rgba(17, 21, 32, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          borderColor: colors.borderSubtle,
        };
      case 'danger':
        return {
          backgroundColor: isDark ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
          borderColor: 'rgba(239, 68, 68, 0.25)',
        };
      case 'default':
      default:
        return {
          backgroundColor: colors.bgCard,
          borderColor: colors.borderSubtle,
          ...Shadows.subtle,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.78}
        onPress={onPress}
        disabled={disabled}
        style={[styles.baseCard, getVariantStyles(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.baseCard, getVariantStyles(), style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  baseCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
  },
});
