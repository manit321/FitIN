import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Exercise } from '../../types';
import { Palette } from '../../constants/colors';
import { Badge } from '../ui/Badge';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface ExerciseListItemProps {
  exercise: Exercise;
  onPress: () => void;
  rightElement?: React.ReactNode;
}

export const ExerciseListItem: React.FC<ExerciseListItemProps> = ({
  exercise,
  onPress,
  rightElement,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.iconCircle}>
        <Ionicons name="barbell" size={20} color={Palette.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {exercise.name}
        </Text>
        <View style={styles.badgeRow}>
          <Badge label={exercise.targetMuscle} variant="cyan" size="sm" />
          <Badge label={exercise.equipment} variant="muted" size="sm" />
          {exercise.personalRecord && (
            <View style={styles.prBadge}>
              <Ionicons name="trophy" size={12} color={Palette.amber} />
              <Text style={styles.prText}>
                {exercise.personalRecord.weightKg}kg × {exercise.personalRecord.reps}
              </Text>
            </View>
          )}
        </View>
      </View>

      {rightElement || (
        <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 245, 155, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  name: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  prBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  prText: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
});
