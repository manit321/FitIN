import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette } from '../../constants/colors';
import { Typography, BorderRadius, Spacing, Shadows } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const getContainerStyle = () => {
    const sizeStyle = styles[`size_${size}`];
    const variantStyle = styles[`variant_${variant}`];
    return [
      styles.base,
      sizeStyle,
      variantStyle,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      variant === 'primary' && Shadows.glowPrimary,
      style,
    ];
  };

  const getTextStyle = () => {
    const textVariantStyle = styles[`text_${variant}`];
    const textSizeStyle = styles[`textSize_${size}`];
    return [
      styles.baseText,
      textVariantStyle,
      textSizeStyle,
      disabled && styles.disabledText,
      textStyle,
    ];
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Palette.textInverse : Palette.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  // Sizes
  size_sm: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    minHeight: 36,
  },
  size_md: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    minHeight: 46,
  },
  size_lg: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 15,
    minHeight: 52,
    borderRadius: BorderRadius.lg,
  },
  // Variants
  variant_primary: {
    backgroundColor: Palette.primary,
  },
  variant_secondary: {
    backgroundColor: Palette.bgCardElevated,
    borderWidth: 1,
    borderColor: Palette.borderDefault,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Palette.primary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
  },
  disabled: {
    opacity: 0.45,
  },
  // Text
  baseText: {
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  textSize_sm: {
    fontSize: Typography.fontSizes.subhead,
  },
  textSize_md: {
    fontSize: Typography.fontSizes.body,
  },
  textSize_lg: {
    fontSize: Typography.fontSizes.headline,
  },
  text_primary: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.heavy,
  },
  text_secondary: {
    color: Palette.textPrimary,
  },
  text_outline: {
    color: Palette.primary,
  },
  text_ghost: {
    color: Palette.primary,
  },
  text_danger: {
    color: Palette.danger,
  },
  disabledText: {
    color: Palette.textDisabled,
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
});
