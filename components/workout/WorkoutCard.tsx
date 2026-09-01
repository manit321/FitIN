import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutRoutine } from '../../types';
import { Palette } from '../../constants/colors';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

interface WorkoutCardProps {
  routine: WorkoutRoutine;
  onPress: () => void;
  onStart: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  routine,
  onPress,
  onStart,
}) => {
  return (
    <Card variant="default" onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Badge
            label={routine.category}
            variant="primary"
            size="sm"
          />
          <Badge
            label={routine.difficulty}
            variant="muted"
            size="sm"
          />
        </View>

        {routine.timesCompleted !== undefined && routine.timesCompleted > 0 && (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Palette.primary} />
            <Text style={styles.completedText}>{routine.timesCompleted} completed</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{routine.name}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {routine.description}
      </Text>

      {/* Meta Stats */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="barbell-outline" size={16} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{routine.exercises.length} Exercises</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={Palette.textSecondary} />
          <Text style={styles.metaText}>{routine.estimatedMinutes} Mins</Text>
        </View>
        {routine.lastPerformedDate && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={Palette.textSecondary} />
            <Text style={styles.metaText}>{formatDate(routine.lastPerformedDate)}</Text>
          </View>
        )}
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <Button
          title="Start Workout"
          onPress={onStart}
          variant="primary"
          size="sm"
          icon={<Ionicons name="play" size={16} color={Palette.textInverse} />}
          style={styles.startBtn}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completedText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  title: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  description: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  startBtn: {
    minWidth: 140,
  },
});
