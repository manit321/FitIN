import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { BorderRadius, Spacing, Typography, Shadows } from '../../constants/theme';
import { formatClockTimer } from '../../utils/formatters';

interface RestTimerModalProps {
  isActive: boolean;
  targetSeconds: number;
  remainingSeconds: number;
  exerciseName?: string;
  onAdjust: (delta: number) => void;
  onSkip: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  isActive,
  targetSeconds,
  remainingSeconds,
  exerciseName,
  onAdjust,
  onSkip,
}) => {
  if (!isActive || remainingSeconds <= 0) return null;

  const progress = targetSeconds > 0 ? remainingSeconds / targetSeconds : 0;

  return (
    <View style={[styles.floatingContainer, Shadows.glowPrimary]}>
      {/* Progress Bar Top Edge */}
      <View style={styles.progressBarTrack}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(100, progress * 100)}%` },
          ]}
        />
      </View>

      <View style={styles.contentRow}>
        <View style={styles.leftInfo}>
          <View style={styles.pulseDot} />
          <View>
            <Text style={styles.timerLabel}>REST TIMER</Text>
            {exerciseName && (
              <Text style={styles.exerciseName} numberOfLines={1}>
                {exerciseName}
              </Text>
            )}
          </View>
        </View>

        {/* Timer Countdown */}
        <Text style={styles.countdown}>
          {formatClockTimer(remainingSeconds)}
        </Text>

        {/* Controls */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => onAdjust(-15)}
            activeOpacity={0.7}
          >
            <Text style={styles.adjustBtnText}>-15s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => onAdjust(30)}
            activeOpacity={0.7}
          >
            <Text style={styles.adjustBtnText}>+30s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipBtn}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Ionicons name="play-skip-forward" size={18} color={Palette.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 85 : 65,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.primary,
    overflow: 'hidden',
    zIndex: 999,
  },
  progressBarTrack: {
    height: 4,
    backgroundColor: Palette.bgInput,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primary,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },
  timerLabel: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.8,
  },
  exerciseName: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    maxWidth: 110,
  },
  countdown: {
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    color: Palette.textPrimary,
    marginHorizontal: Spacing.sm,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adjustBtn: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.xs,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  adjustBtnText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  skipBtn: {
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.xs,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
