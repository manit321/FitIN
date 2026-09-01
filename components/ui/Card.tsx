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
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return [styles.elevatedCard, Shadows.card];
      case 'highlight':
        return [styles.highlightCard, Shadows.glowPrimary];
      case 'glass':
        return styles.glassCard;
      case 'danger':
        return styles.dangerCard;
      case 'default':
      default:
        return [styles.defaultCard, Shadows.subtle];
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
  defaultCard: {
    backgroundColor: Palette.bgCard,
    borderColor: Palette.borderSubtle,
  },
  elevatedCard: {
    backgroundColor: Palette.bgCardElevated,
    borderColor: Palette.borderDefault,
  },
  highlightCard: {
    backgroundColor: Palette.bgCardElevated,
    borderColor: 'rgba(0, 245, 155, 0.35)',
  },
  glassCard: {
    backgroundColor: 'rgba(17, 21, 32, 0.85)',
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
});
