import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { CompletedWorkout } from '../../types';

interface ActivityHeatmapProps {
  completedWorkouts: CompletedWorkout[];
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  completedWorkouts,
}) => {
  const workoutDates = new Set(completedWorkouts.map((w) => w.date));

  // Generate last 28 days (4 weeks)
  const days: { dateStr: string; dayNum: number; hasWorkout: boolean; isToday: boolean }[] = [];
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      dateStr,
      dayNum: d.getDate(),
      hasWorkout: workoutDates.has(dateStr),
      isToday: dateStr === todayStr,
    });
  }

  // Split into 4 rows of 7 days
  const weeks: typeof days[] = [];
  for (let i = 0; i < 4; i++) {
    weeks.push(days.slice(i * 7, (i + 1) * 7));
  }

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.container}>
      <View style={styles.daysHeader}>
        {daysOfWeek.map((d, idx) => (
          <Text key={idx} style={styles.dayLabel}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {weeks.map((week, wIdx) => (
          <View key={wIdx} style={styles.weekRow}>
            {week.map((item, dIdx) => (
              <View
                key={dIdx}
                style={[
                  styles.daySquare,
                  item.hasWorkout && styles.dayActive,
                  item.isToday && styles.dayToday,
                ]}
              >
                {item.hasWorkout && <View style={styles.activeDot} />}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.daySquare]} />
          <Text style={styles.legendText}>Rest</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSquare, styles.dayActive]} />
          <Text style={styles.legendText}>Workout Completed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
    paddingHorizontal: 4,
  },
  dayLabel: {
    width: 28,
    textAlign: 'center',
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  grid: {
    gap: 6,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  daySquare: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xs,
    backgroundColor: Palette.bgInput,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    backgroundColor: 'rgba(0, 245, 155, 0.25)',
    borderColor: Palette.primary,
  },
  dayToday: {
    borderColor: Palette.cyan,
    borderWidth: 1.5,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.primary,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSquare: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
});
