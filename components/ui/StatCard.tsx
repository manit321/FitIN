import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Card } from './Card';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface StatCardProps {
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  value: string | number;
  label: string;
  unit?: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  style?: ViewStyle;
  valueStyle?: TextStyle;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  iconColor = Palette.primary,
  value,
  label,
  unit,
  trend,
  trendDirection = 'neutral',
  style,
  valueStyle,
  onPress,
}) => {
  const getTrendColor = () => {
    switch (trendDirection) {
      case 'up':
        return Palette.success;
      case 'down':
        return Palette.rose;
      case 'neutral':
      default:
        return Palette.textSecondary;
    }
  };

  return (
    <Card variant="elevated" onPress={onPress} style={[styles.card, style]}>
      <View style={styles.topRow}>
        {icon && (
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: `${iconColor}18` },
            ]}
          >
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
        )}
        {trend && (
          <View style={styles.trendRow}>
            {trendDirection === 'up' && (
              <Ionicons name="trending-up" size={14} color={Palette.success} />
            )}
            {trendDirection === 'down' && (
              <Ionicons name="trending-down" size={14} color={Palette.rose} />
            )}
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {trend}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.contentCol}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, valueStyle]}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Palette.bgInput,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  trendText: {
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  contentCol: {
    marginTop: Spacing.xs,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: -0.5,
  },
  unit: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
    marginLeft: 4,
  },
  label: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
    marginTop: 2,
  },
});
