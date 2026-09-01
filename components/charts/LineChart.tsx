import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Line,
} from 'react-native-svg';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

export interface DataPoint {
  label: string;
  value: number;
  date?: string;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  unit?: string;
  gradientFrom?: string;
  gradientTo?: string;
  showPoints?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 180,
  color = Palette.primary,
  unit = '',
  gradientFrom = Palette.primary,
  gradientTo = 'rgba(0, 245, 155, 0)',
  showPoints = true,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(
    data.length > 0 ? data.length - 1 : null
  );

  if (!data || data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width - Spacing.lg * 2 - Spacing.lg * 2;
  const chartWidth = Math.max(280, screenWidth);
  const chartHeight = height - 40;
  const paddingX = 20;
  const paddingY = 20;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const valRange = maxVal - minVal === 0 ? 1 : maxVal - minVal;

  const points = data.map((d, index) => {
    const x =
      paddingX +
      (index / Math.max(1, data.length - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((d.value - minVal) / valRange) * (chartHeight - paddingY * 2);
    return { x, y, ...d, index };
  });

  // Construct SVG Path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    // Smooth Bezier Curve
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    const cp2y = curr.y;
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
  }

  // Construct Closed Area Path for Gradient
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaD = `${pathD} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;

  const selectedPoint =
    selectedIndex !== null && points[selectedIndex]
      ? points[selectedIndex]
      : points[points.length - 1];

  return (
    <View style={styles.container}>
      {/* Selected Tooltip */}
      {selectedPoint && (
        <View style={styles.tooltipRow}>
          <Text style={styles.tooltipLabel}>{selectedPoint.label}</Text>
          <Text style={[styles.tooltipValue, { color }]}>
            {selectedPoint.value} {unit}
          </Text>
        </View>
      )}

      <Svg width={chartWidth} height={chartHeight} style={styles.svg}>
        <Defs>
          <LinearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={gradientFrom} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={gradientTo} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Horizontal grid lines */}
        <Line
          x1={paddingX}
          y1={paddingY}
          x2={chartWidth - paddingX}
          y2={paddingY}
          stroke={Palette.borderSubtle}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={paddingX}
          y1={chartHeight / 2}
          x2={chartWidth - paddingX}
          y2={chartHeight / 2}
          stroke={Palette.borderSubtle}
          strokeDasharray="4 4"
          strokeWidth={1}
        />
        <Line
          x1={paddingX}
          y1={chartHeight - paddingY}
          x2={chartWidth - paddingX}
          y2={chartHeight - paddingY}
          stroke={Palette.borderSubtle}
          strokeDasharray="4 4"
          strokeWidth={1}
        />

        {/* Area Gradient Fill */}
        <Path d={areaD} fill="url(#lineGradient)" />

        {/* Smooth Line */}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Points */}
        {showPoints &&
          points.map((p, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <Circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? Palette.textPrimary : color}
                stroke={Palette.bgCard}
                strokeWidth={2}
              />
            );
          })}
      </Svg>

      {/* Interactive touch selectors & bottom labels */}
      <View style={[styles.labelsRow, { width: chartWidth }]}>
        {points.map((p, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedIndex(idx)}
            style={styles.labelTouchable}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.xLabel,
                selectedIndex === idx && [styles.xLabelSelected, { color }],
              ]}
              numberOfLines={1}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
  },
  tooltipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
  tooltipLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.medium,
  },
  tooltipValue: {
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  svg: {
    overflow: 'visible',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: Spacing.xs,
  },
  labelTouchable: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  xLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  xLabelSelected: {
    fontWeight: Typography.fontWeights.bold,
  },
});
