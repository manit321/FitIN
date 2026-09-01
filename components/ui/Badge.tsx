import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Palette } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'cyan' | 'orange' | 'purple' | 'muted' | 'danger' | 'success';
  size?: 'sm' | 'md';
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'muted',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'primary':
        return { bg: 'rgba(0, 245, 155, 0.12)', text: Palette.primary, border: 'rgba(0, 245, 155, 0.3)' };
      case 'cyan':
        return { bg: 'rgba(0, 210, 255, 0.12)', text: Palette.cyan, border: 'rgba(0, 210, 255, 0.3)' };
      case 'orange':
        return { bg: 'rgba(255, 107, 0, 0.12)', text: Palette.orange, border: 'rgba(255, 107, 0, 0.3)' };
      case 'purple':
        return { bg: 'rgba(139, 92, 246, 0.12)', text: Palette.purple, border: 'rgba(139, 92, 246, 0.3)' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.12)', text: Palette.danger, border: 'rgba(239, 68, 68, 0.3)' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.12)', text: Palette.success, border: 'rgba(16, 185, 129, 0.3)' };
      case 'muted':
      default:
        return { bg: 'rgba(148, 163, 184, 0.1)', text: Palette.textSecondary, border: 'rgba(148, 163, 184, 0.2)' };
    }
  };

  const colors = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: isSm ? Spacing.sm : Spacing.md,
          paddingVertical: isSm ? 2 : Spacing.xs,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSm ? Typography.fontSizes.caption : Typography.fontSizes.subhead,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {
    fontWeight: Typography.fontWeights.semibold,
    textTransform: 'capitalize',
  },
});
