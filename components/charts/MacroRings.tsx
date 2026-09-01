import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Palette } from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';

interface MacroRingsProps {
  size?: number;
  consumedCalories: number;
  targetCalories: number;
  proteinG: number;
  targetProteinG: number;
  carbsG: number;
  targetCarbsG: number;
  fatG: number;
  targetFatG: number;
}

export const MacroRings: React.FC<MacroRingsProps> = ({
  size = 180,
  consumedCalories,
  targetCalories,
  proteinG,
  targetProteinG,
  carbsG,
  targetCarbsG,
  fatG,
  targetFatG,
}) => {
  const center = size / 2;
  const strokeWidth = 10;
  const gap = 4;

  const rProtein = center - strokeWidth / 2 - 2;
  const rCarbs = rProtein - strokeWidth - gap;
  const rFat = rCarbs - strokeWidth - gap;

  const getRingParams = (current: number, target: number, radius: number) => {
    const p = target > 0 ? Math.min(1, Math.max(0, current / target)) : 0;
    const circ = 2 * Math.PI * radius;
    const offset = circ - p * circ;
    return { circumference: circ, offset };
  };

  const proteinParams = getRingParams(proteinG, targetProteinG, rProtein);
  const carbsParams = getRingParams(carbsG, targetCarbsG, rCarbs);
  const fatParams = getRingParams(fatG, targetFatG, rFat);

  const remainingCalories = Math.max(0, targetCalories - consumedCalories);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background Tracks */}
        <Circle
          cx={center}
          cy={center}
          r={rProtein}
          stroke={Palette.bgInput}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={rCarbs}
          stroke={Palette.bgInput}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={rFat}
          stroke={Palette.bgInput}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Protein Ring (Outer - Green) */}
        <Circle
          cx={center}
          cy={center}
          r={rProtein}
          stroke={Palette.protein}
          strokeWidth={strokeWidth}
          strokeDasharray={`${proteinParams.circumference} ${proteinParams.circumference}`}
          strokeDashoffset={proteinParams.offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Carbs Ring (Middle - Cyan) */}
        <Circle
          cx={center}
          cy={center}
          r={rCarbs}
          stroke={Palette.carbs}
          strokeWidth={strokeWidth}
          strokeDasharray={`${carbsParams.circumference} ${carbsParams.circumference}`}
          strokeDashoffset={carbsParams.offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />

        {/* Fat Ring (Inner - Amber) */}
        <Circle
          cx={center}
          cy={center}
          r={rFat}
          stroke={Palette.fat}
          strokeWidth={strokeWidth}
          strokeDasharray={`${fatParams.circumference} ${fatParams.circumference}`}
          strokeDashoffset={fatParams.offset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>

      {/* Center Calorie Stats */}
      <View style={styles.centerContent}>
        <Text style={styles.remainingVal}>{remainingCalories}</Text>
        <Text style={styles.remainingLabel}>KCAL LEFT</Text>
        <Text style={styles.consumedSub}>
          {Math.round(consumedCalories)} / {targetCalories}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingVal: {
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.black,
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  remainingLabel: {
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    color: Palette.primary,
    letterSpacing: 0.8,
    marginTop: -2,
  },
  consumedSub: {
    fontSize: Typography.fontSizes.caption,
    color: Palette.textMuted,
    marginTop: 2,
    fontWeight: Typography.fontWeights.medium,
  },
});
