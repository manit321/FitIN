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
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';

export default function RoutineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { routines, exercises, startWorkout, deleteRoutine } = useFitness();

  const routine = routines.find((r) => r.id === id);

  if (!routine) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Workout routine not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleStart = () => {
    startWorkout(routine);
    router.replace('/workout/active');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Routine Details</Text>
        {routine.isCustom && (
          <TouchableOpacity
            onPress={async () => {
              await deleteRoutine(routine.id);
              router.back();
            }}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={20} color={Palette.danger} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO CARD */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.badgeRow}>
            <Badge label={routine.category} variant="primary" size="sm" />
            <Badge label={routine.difficulty} variant="cyan" size="sm" />
            {routine.timesCompleted !== undefined && (
              <Badge
                label={`${routine.timesCompleted} Done`}
                variant="muted"
                size="sm"
              />
            )}
          </View>

          <Text style={styles.routineTitle}>{routine.name}</Text>
          <Text style={styles.routineDesc}>{routine.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="barbell-outline" size={20} color={Palette.primary} />
              <Text style={styles.statVal}>{routine.exercises.length}</Text>
              <Text style={styles.statLabel}>Exercises</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="time-outline" size={20} color={Palette.cyan} />
              <Text style={styles.statVal}>{routine.estimatedMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="calendar-outline" size={20} color={Palette.orange} />
              <Text style={styles.statVal}>
                {routine.lastPerformedDate ? formatDate(routine.lastPerformedDate) : '—'}
              </Text>
              <Text style={styles.statLabel}>Last Trained</Text>
            </View>
          </View>
        </Card>

        {/* EXERCISES LIST */}
        <Text style={styles.sectionHeading}>
          Exercise Plan ({routine.exercises.length})
        </Text>

        {routine.exercises.map((re, idx) => {
          const ex = exercises.find((e) => e.id === re.exerciseId);
          return (
            <Card key={idx} variant="default" style={styles.exCard}>
              <View style={styles.exHeader}>
                <View style={styles.exIndexCircle}>
                  <Text style={styles.exIndexText}>{idx + 1}</Text>
                </View>
                <View style={styles.exDetails}>
                  <Text style={styles.exName}>
                    {ex ? ex.name : 'Custom Exercise'}
                  </Text>
                  <Text style={styles.exMuscle}>
                    {ex?.targetMuscle || 'Target Muscle'} • {ex?.equipment || 'Equipment'}
                  </Text>
                </View>
                {ex && (
                  <TouchableOpacity
                    onPress={() => router.push(`/exercise/${ex.id}`)}
                    style={styles.exInfoBtn}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={Palette.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.targetsRow}>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetLabel}>Sets:</Text>
                  <Text style={styles.targetVal}>{re.targetSets}</Text>
                </View>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetLabel}>Reps:</Text>
                  <Text style={styles.targetVal}>
                    {re.targetRepsMin}-{re.targetRepsMax}
                  </Text>
                </View>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetLabel}>Weight:</Text>
                  <Text style={styles.targetVal}>
                    {re.targetWeightKg ? `${re.targetWeightKg}kg` : 'Auto'}
                  </Text>
                </View>
                <View style={styles.targetBadge}>
                  <Text style={styles.targetLabel}>Rest:</Text>
                  <Text style={styles.targetVal}>{re.restSeconds}s</Text>
                </View>
              </View>

              {re.notes && <Text style={styles.exNotes}>💡 {re.notes}</Text>}
            </Card>
          );
        })}
      </ScrollView>

      {/* Floating Bottom Start Button */}
      <View style={styles.bottomBar}>
        <Button
          title="Start This Workout"
          onPress={handleStart}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Ionicons name="play" size={20} color={Palette.textInverse} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.body,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  heroCard: {
    marginBottom: Spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  routineTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.black,
    marginBottom: 6,
  },
  routineDesc: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.body,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
    marginTop: 4,
  },
  statLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  sectionHeading: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.md,
  },
  exCard: {
    marginBottom: Spacing.md,
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exIndexCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  exIndexText: {
    color: Palette.primary,
    fontWeight: Typography.fontWeights.bold,
    fontSize: Typography.fontSizes.caption,
  },
  exDetails: {
    flex: 1,
  },
  exName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  exMuscle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  exInfoBtn: {
    padding: Spacing.xs,
  },
  targetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
  },
  targetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  targetLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  targetVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  exNotes: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.caption,
    marginTop: Spacing.sm,
    lineHeight: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.bgCard,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },
});
