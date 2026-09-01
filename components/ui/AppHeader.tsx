import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  streakDays?: number;
  rightAction?: React.ReactNode;
  onStreakPress?: () => void;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  streakDays,
  rightAction,
  onStreakPress,
  style,
}) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.titleColumn}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.rightGroup}>
        {streakDays !== undefined && (
          <TouchableOpacity
            style={styles.streakBadge}
            onPress={onStreakPress}
            activeOpacity={0.8}
          >
            <Ionicons name="flame" size={18} color={Palette.orange} />
            <Text style={styles.streakText}>{streakDays}d</Text>
          </TouchableOpacity>
        )}
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  titleColumn: {
    flex: 1,
  },
  subtitle: {
    fontSize: Typography.fontSizes.subhead,
    color: Palette.primary,
    fontWeight: Typography.fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  title: {
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.heavy,
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.3)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 4,
  },
  streakText: {
    color: Palette.orange,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.heavy,
  },
});
