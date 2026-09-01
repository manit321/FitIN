import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Palette } from '../../constants/colors';
import { Typography } from '../../constants/theme';

interface MacroRingsProps {
  calories: { current: number; target: number };
  protein: { current: number; target: number };
  carbs: { current: number; target: number };
  fat: { current: number; target: number };
  size?: number;
}

export const MacroRings: React.FC<MacroRingsProps> = ({
  calories,
  protein,
  carbs,
  size = 180,
}) => {
  const strokeWidth = 10;
  const gap = 3;
  const center = size / 2;

  // Ring 1: Calories (Outer)
  const rCal = center - strokeWidth / 2 - 2;
  const circCal = 2 * Math.PI * rCal;
  const pctCal = Math.min(1, Math.max(0, calories.current / (calories.target || 1)));
  const strokeDashoffsetCal = circCal * (1 - pctCal);

  // Ring 2: Protein (Middle)
  const rProt = rCal - strokeWidth - gap;
  const circProt = 2 * Math.PI * rProt;
  const pctProt = Math.min(1, Math.max(0, protein.current / (protein.target || 1)));
  const strokeDashoffsetProt = circProt * (1 - pctProt);

  // Ring 3: Carbs (Inner-Middle)
  const rCarb = rProt - strokeWidth - gap;
  const circCarb = 2 * Math.PI * rCarb;
  const pctCarb = Math.min(1, Math.max(0, carbs.current / (carbs.target || 1)));
  const strokeDashoffsetCarb = circCarb * (1 - pctCarb);

  const remainingCals = Math.max(0, calories.target - calories.current);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Track 1 (Calories) */}
          <Circle
            cx={center}
            cy={center}
            r={rCal}
            stroke="rgba(234, 88, 12, 0.12)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active Ring 1 (Calories) */}
          <Circle
            cx={center}
            cy={center}
            r={rCal}
            stroke={Palette.calories}
            strokeWidth={strokeWidth}
            strokeDasharray={circCal}
            strokeDashoffset={strokeDashoffsetCal}
            strokeLinecap="round"
            fill="none"
          />

          {/* Background Track 2 (Protein) */}
          <Circle
            cx={center}
            cy={center}
            r={rProt}
            stroke="rgba(2, 132, 199, 0.12)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active Ring 2 (Protein) */}
          <Circle
            cx={center}
            cy={center}
            r={rProt}
            stroke={Palette.protein}
            strokeWidth={strokeWidth}
            strokeDasharray={circProt}
            strokeDashoffset={strokeDashoffsetProt}
            strokeLinecap="round"
            fill="none"
          />

          {/* Background Track 3 (Carbs) */}
          <Circle
            cx={center}
            cy={center}
            r={rCarb}
            stroke="rgba(6, 182, 212, 0.12)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Active Ring 3 (Carbs) */}
          <Circle
            cx={center}
            cy={center}
            r={rCarb}
            stroke={Palette.carbs}
            strokeWidth={strokeWidth}
            strokeDasharray={circCarb}
            strokeDashoffset={strokeDashoffsetCarb}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>

      {/* Center Calorie Display */}
      <View style={styles.centerTextContainer}>
        <Text style={styles.remainingVal}>{remainingCals}</Text>
        <Text style={styles.remainingLabel}>KCAL LEFT</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -0.5,
  },
  remainingLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.8,
    marginTop: 1,
  },
});
