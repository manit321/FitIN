import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatWater } from '../../utils/formatters';

interface WaterTrackerCardProps {
  currentWaterMl: number;
  targetWaterMl: number;
  waterUnit?: 'ml' | 'oz';
  onAddWater: (amountMl: number) => void;
  onResetWater?: () => void;
}

export const WaterTrackerCard: React.FC<WaterTrackerCardProps> = ({
  currentWaterMl,
  targetWaterMl,
  waterUnit = 'ml',
  onAddWater,
  onResetWater,
}) => {
  const percentage =
    targetWaterMl > 0
      ? Math.min(100, Math.round((currentWaterMl / targetWaterMl) * 100))
      : 0;

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <Card variant="default" style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="water" size={20} color={Palette.water} />
          </View>
          <View>
            <Text style={styles.title}>Hydration Tracker</Text>
            <Text style={styles.subtitle}>Daily fluid intake</Text>
          </View>
        </View>

        <View style={styles.statsCol}>
          <Text style={styles.currentText}>
            {formatWater(currentWaterMl, waterUnit)}
          </Text>
          <Text style={styles.targetText}>
            Goal: {formatWater(targetWaterMl, waterUnit)}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <ProgressBar
        current={currentWaterMl}
        target={targetWaterMl}
        color={Palette.water}
        height={10}
        showValues={false}
        style={styles.progressBar}
      />

      <View style={styles.percentageRow}>
        <Text style={styles.percentText}>{percentage}% Completed</Text>
        {onResetWater && currentWaterMl > 0 && (
          <TouchableOpacity onPress={onResetWater} activeOpacity={0.7}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick Add Buttons */}
      <View style={styles.buttonRow}>
        {quickAmounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={styles.quickBtn}
            onPress={() => onAddWater(amount)}
            activeOpacity={0.75}
          >
            <Ionicons name="add" size={14} color={Palette.water} />
            <Text style={styles.quickBtnText}>
              {amount >= 1000 ? '1L' : `${amount}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
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
  },
  statsCol: {
    alignItems: 'flex-end',
  },
  currentText: {
    color: Palette.water,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  targetText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  progressBar: {
    marginVertical: Spacing.xs,
  },
  percentageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  percentText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  resetText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    gap: 2,
  },
  quickBtnText: {
    color: Palette.water,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
});
