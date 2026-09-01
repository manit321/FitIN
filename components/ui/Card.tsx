import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { Palette } from '../../constants/colors';
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
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Palette.bgCard,
          borderColor: Palette.borderSubtle,
          ...Shadows.elevated,
        };
      case 'highlight':
        return {
          backgroundColor: Palette.bgCardElevated,
          borderColor: 'rgba(2, 132, 199, 0.35)',
          ...Shadows.glowPrimary,
        };
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: Palette.borderSubtle,
          ...Shadows.subtle,
        };
      case 'danger':
        return {
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderColor: 'rgba(239, 68, 68, 0.20)',
        };
      case 'default':
      default:
        return {
          backgroundColor: Palette.bgCard,
          borderColor: Palette.borderSubtle,
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
