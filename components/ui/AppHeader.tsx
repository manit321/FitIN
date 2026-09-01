import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  streakDays?: number;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  streakDays,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftCol}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightRow}>
        {typeof streakDays === 'number' && streakDays > 0 && (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={16} color={Palette.orange} />
            <Text style={styles.streakText}>{streakDays}d</Text>
          </View>
        )}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  leftCol: {
    flex: 1,
  },
  subtitle: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  title: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: -0.6,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.25)',
    gap: 4,
  },
  streakText: {
    color: Palette.orange,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
  },
});
