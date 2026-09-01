import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Palette } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  unit?: string;
  color?: string;
  height?: number;
  showValues?: boolean;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  unit = '',
  color = Palette.primary,
  height = 8,
  showValues = true,
  style,
}) => {
  const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const isOver = target > 0 && current > target;

  return (
    <View style={[styles.container, style]}>
      {(label || showValues) && (
        <View style={styles.labelRow}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValues && (
            <Text style={styles.values}>
              <Text style={[styles.currentVal, { color: isOver ? Palette.danger : color }]}>
                {Math.round(current)}
              </Text>
              <Text style={styles.targetVal}> / {Math.round(target)} {unit}</Text>
              <Text style={[styles.percentVal, { color }]}> ({percentage}%)</Text>
            </Text>
          )}
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.min(100, percentage)}%`,
              backgroundColor: isOver ? Palette.danger : color,
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.medium,
  },
  values: {
    fontSize: Typography.fontSizes.subhead,
  },
  currentVal: {
    fontWeight: Typography.fontWeights.bold,
  },
  targetVal: {
    color: Palette.textMuted,
    fontWeight: Typography.fontWeights.medium,
  },
  percentVal: {
    fontWeight: Typography.fontWeights.semibold,
  },
  track: {
    width: '100%',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
});
