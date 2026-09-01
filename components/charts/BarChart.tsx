import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export interface BarDataPoint {
  label: string;
  value: number;
  target?: number;
  highlight?: boolean;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  barColor?: string;
  activeBarColor?: string;
  unit?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 160,
  barColor = 'rgba(0, 245, 155, 0.35)',
  activeBarColor = Palette.primary,
  unit = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    data.length > 0 ? data.length - 1 : null
  );

  if (!data || data.length === 0) {
    return null;
  }

  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 50;

  const selectedItem =
    selectedIndex !== null ? data[selectedIndex] : data[data.length - 1];

  return (
    <View style={styles.container}>
      {selectedItem && (
        <View style={styles.headerRow}>
          <Text style={styles.headerLabel}>{selectedItem.label}</Text>
          <Text style={styles.headerValue}>
            {selectedItem.value} {unit}
          </Text>
        </View>
      )}

      <View style={[styles.chartArea, { height: chartHeight }]}>
        {data.map((item, idx) => {
          const isSelected = selectedIndex === idx;
          const barHeightPct = Math.max(8, (item.value / maxVal) * 100);

          return (
            <TouchableOpacity
              key={idx}
              style={styles.barColumn}
              onPress={() => setSelectedIndex(idx)}
              activeOpacity={0.8}
            >
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${barHeightPct}%`,
                      backgroundColor:
                        isSelected || item.highlight
                          ? activeBarColor
                          : barColor,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  isSelected && styles.barLabelSelected,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  headerLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.medium,
  },
  headerValue: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barTrack: {
    flex: 1,
    width: 22,
    justifyContent: 'flex-end',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: BorderRadius.sm,
  },
  barLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
    marginTop: 6,
  },
  barLabelSelected: {
    color: Palette.textPrimary,
    fontWeight: Typography.fontWeights.bold,
  },
});
