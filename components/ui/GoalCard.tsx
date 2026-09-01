import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface GoalCardProps {
  title: string;
  subtitle?: string;
  current: number;
  target: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  title,
  subtitle,
  current,
  target,
  unit,
  icon,
  color = Palette.primary,
  style,
  onPress,
}) => {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  return (
    <Card variant="default" onPress={onPress} style={[styles.card, style]}>
      <View style={styles.header}>
        <View style={styles.leftInfo}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}18` }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        </View>
        <Text style={[styles.percentText, { color }]}>{percentage}%</Text>
      </View>

      <ProgressBar
        current={current}
        target={target}
        unit={unit}
        color={color}
        height={8}
        showValues={true}
        style={styles.progressBar}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  subtitle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  percentText: {
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
  },
  progressBar: {
    marginTop: Spacing.xs,
  },
});
