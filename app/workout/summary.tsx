import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { formatDuration } from '../../utils/formatters';

export default function WorkoutSummaryScreen() {
  const router = useRouter();
  const { completedWorkouts } = useFitness();
  const params = useLocalSearchParams<{
    workoutId?: string;
    duration?: string;
    volume?: string;
    sets?: string;
    calories?: string;
    routineName?: string;
    prsCount?: string;
  }>();

  const latestWorkout =
    (params.workoutId && completedWorkouts.find((w) => w.id === params.workoutId)) ||
    completedWorkouts[0];

  const durationSecs = params.duration ? parseInt(params.duration, 10) : latestWorkout?.durationSeconds || 0;
  const volumeKg = params.volume ? parseFloat(params.volume) : latestWorkout?.totalVolumeKg || 0;
  const setsCount = params.sets ? parseInt(params.sets, 10) : latestWorkout?.totalSetsCompleted || 0;
  const calories = params.calories ? parseInt(params.calories, 10) : latestWorkout?.caloriesBurned || 0;
  const routineTitle = params.routineName || latestWorkout?.routineName || 'Workout Session';
  const prs = latestWorkout?.personalRecordsBroken || [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CELEBRATION HEADER */}
        <View style={styles.celebrationHeader}>
          <View style={[styles.trophyCircle, Shadows.glowPrimary]}>
            <Ionicons name="trophy" size={48} color={Palette.primary} />
          </View>
          <Text style={styles.congratsText}>WORKOUT CRUSHED! 🚀</Text>
          <Text style={styles.routineTitle}>{routineTitle}</Text>
        </View>

        {/* PR BROKEN BANNER */}
        {prs.length > 0 && (
          <Card variant="highlight" style={styles.prCard}>
            <View style={styles.prCardHeader}>
              <Ionicons name="flame" size={24} color={Palette.amber} />
              <Text style={styles.prCardTitle}>New Personal Record Set!</Text>
            </View>
            {prs.map((pr, idx) => (
              <View key={idx} style={styles.prItem}>
                <Text style={styles.prExName}>{pr.exerciseName}</Text>
                <Text style={styles.prDetails}>
                  {pr.weightKg} kg × {pr.reps} reps (1RM: {pr.new1RM} kg)
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* MAIN STATS MATRIX */}
        <View style={styles.statsMatrix}>
          <Card variant="elevated" style={styles.statBox}>
            <Ionicons name="time-outline" size={22} color={Palette.cyan} />
            <Text style={styles.statVal}>{formatDuration(durationSecs)}</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </Card>

          <Card variant="elevated" style={styles.statBox}>
            <Ionicons name="barbell-outline" size={22} color={Palette.primary} />
            <Text style={styles.statVal}>{volumeKg.toLocaleString()} kg</Text>
            <Text style={styles.statLabel}>Total Volume</Text>
          </Card>

          <Card variant="elevated" style={styles.statBox}>
            <Ionicons name="checkmark-done" size={22} color={Palette.purple} />
            <Text style={styles.statVal}>{setsCount}</Text>
            <Text style={styles.statLabel}>Sets Finished</Text>
          </Card>

          <Card variant="elevated" style={styles.statBox}>
            <Ionicons name="flame" size={22} color={Palette.orange} />
            <Text style={styles.statVal}>{calories} kcal</Text>
            <Text style={styles.statLabel}>Est. Calories</Text>
          </Card>
        </View>

        {/* EXERCISES BREAKDOWN */}
        {latestWorkout?.exercises && latestWorkout.exercises.length > 0 && (
          <Card variant="default" style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Exercise Summary</Text>
            {latestWorkout.exercises.map((ex, idx) => (
              <View key={idx} style={styles.exSummaryRow}>
                <View style={styles.exInfo}>
                  <Text style={styles.exSummaryName}>{ex.exerciseName}</Text>
                  <Text style={styles.exSummaryMuscle}>{ex.targetMuscle}</Text>
                </View>
                <Text style={styles.exSummarySets}>
                  {ex.sets.length} sets completed
                </Text>
              </View>
            ))}
          </Card>
        )}

        {/* RETURN BUTTON */}
        <View style={styles.actionButtons}>
          <Button
            title="Return to Dashboard"
            onPress={() => router.replace('/(tabs)')}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="home" size={20} color={Palette.textInverse} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  celebrationHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  trophyCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  congratsText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1.2,
  },
  routineTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.black,
    marginTop: 4,
    textAlign: 'center',
  },
  prCard: {
    marginBottom: Spacing.lg,
  },
  prCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  prCardTitle: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  prItem: {
    marginTop: 4,
  },
  prExName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  prDetails: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
  },
  statsMatrix: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statBox: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    marginTop: 6,
  },
  statLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  breakdownCard: {
    marginBottom: Spacing.xl,
  },
  breakdownTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.md,
  },
  exSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  exInfo: {
    flex: 1,
  },
  exSummaryName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  exSummaryMuscle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  exSummarySets: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  actionButtons: {
    marginTop: Spacing.sm,
  },
});
