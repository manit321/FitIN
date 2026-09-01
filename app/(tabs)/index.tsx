import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { MacroRings } from '../../components/charts/MacroRings';
import { BarChart, BarDataPoint } from '../../components/charts/BarChart';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatFullDate, formatWeight, formatWater } from '../../utils/formatters';
import { calculateStreak } from '../../utils/calculations';

export default function HomeScreen() {
  const router = useRouter();
  const {
    profile,
    settings,
    routines,
    completedWorkouts,
    loggedMeals,
    waterLogs,
    startWorkout,
    addWater,
  } = useFitness();

  const todayStr = new Date().toISOString().split('T')[0];

  // Nutrition Totals
  const todayMeals = loggedMeals.filter((m) => m.date === todayStr);
  const consumedCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = Math.round(todayMeals.reduce((acc, m) => acc + m.proteinG, 0) * 10) / 10;
  const consumedCarbs = Math.round(todayMeals.reduce((acc, m) => acc + m.carbsG, 0) * 10) / 10;
  const consumedFat = Math.round(todayMeals.reduce((acc, m) => acc + m.fatG, 0) * 10) / 10;

  // Water Totals
  const todayWaterLogs = waterLogs.filter((w) => w.date === todayStr);
  const currentWaterMl = todayWaterLogs.reduce((acc, w) => acc + w.amountMl, 0);

  // Today's Workout
  const todayWorkout = completedWorkouts.find((w) => w.date === todayStr);
  const suggestedRoutine = routines.length > 0 ? routines[0] : null;

  // Streak
  const loggedDates = Array.from(new Set(loggedMeals.map((m) => m.date)));
  const streak = calculateStreak(completedWorkouts, loggedDates);

  // Weekly data for BarChart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7;

  const weeklyData: BarDataPoint[] = weekDays.map((dayName, idx) => {
    const diff = idx - currentDayIndex;
    const d = new Date(todayDate);
    d.setDate(d.getDate() + diff);
    const dStr = d.toISOString().split('T')[0];
    const hasWorkout = completedWorkouts.some((w) => w.date === dStr);
    const dayCalories = loggedMeals
      .filter((m) => m.date === dStr)
      .reduce((acc, m) => acc + m.calories, 0);

    return {
      label: dayName,
      value: hasWorkout ? 100 : dayCalories > 0 ? 50 : 0,
      highlight: idx === currentDayIndex,
    };
  });

  const weightDelta = Math.round((profile.weightKg - profile.targetWeightKg) * 10) / 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Apple-Style App Header */}
        <AppHeader
          subtitle={formatFullDate()}
          title={`Hey, ${profile.name.split(' ')[0]} 👋`}
          streakDays={streak}
          rightAction={
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.avatarBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="person-circle" size={36} color={Palette.primary} />
            </TouchableOpacity>
          }
        />

        {/* HERO NUTRITION & ENERGY HUB */}
        <Card variant="elevated" style={styles.heroEnergyCard}>
          <View style={styles.macroRow}>
            <MacroRings
              calories={{ current: consumedCalories, target: profile.targetCalories }}
              protein={{ current: consumedProtein, target: profile.targetProteinG }}
              carbs={{ current: consumedCarbs, target: profile.targetCarbsG }}
              fat={{ current: consumedFat, target: profile.targetFatG }}
              size={154}
            />

            <View style={styles.macroDetailsCol}>
              {/* Calories */}
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <View style={[styles.macroDot, { backgroundColor: Palette.calories }]} />
                  <Text style={styles.macroName}>Calories</Text>
                </View>
                <Text style={styles.macroValue}>
                  {consumedCalories}{' '}
                  <Text style={styles.macroTarget}>/ {profile.targetCalories} kcal</Text>
                </Text>
              </View>

              {/* Protein */}
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <View style={[styles.macroDot, { backgroundColor: Palette.protein }]} />
                  <Text style={styles.macroName}>Protein</Text>
                </View>
                <Text style={styles.macroValue}>
                  {consumedProtein}g{' '}
                  <Text style={styles.macroTarget}>/ {profile.targetProteinG}g</Text>
                </Text>
              </View>

              {/* Carbs */}
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <View style={[styles.macroDot, { backgroundColor: Palette.carbs }]} />
                  <Text style={styles.macroName}>Carbs</Text>
                </View>
                <Text style={styles.macroValue}>
                  {consumedCarbs}g{' '}
                  <Text style={styles.macroTarget}>/ {profile.targetCarbsG}g</Text>
                </Text>
              </View>

              {/* Fat */}
              <View style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <View style={[styles.macroDot, { backgroundColor: Palette.fat }]} />
                  <Text style={styles.macroName}>Fat</Text>
                </View>
                <Text style={styles.macroValue}>
                  {consumedFat}g{' '}
                  <Text style={styles.macroTarget}>/ {profile.targetFatG}g</Text>
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* QUICK ACTION CHIPS */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity
            style={styles.quickChip}
            onPress={() => {
              if (suggestedRoutine) {
                startWorkout(suggestedRoutine);
                router.push('/workout/active');
              } else {
                router.push('/workouts');
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={15} color={Palette.primary} />
            <Text style={styles.quickChipText}>Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickChip}
            onPress={() => router.push('/nutrition/add-food')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={Palette.cyan} />
            <Text style={styles.quickChipText}>Log Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickChip}
            onPress={() => addWater(250)}
            activeOpacity={0.8}
          >
            <Ionicons name="water" size={15} color={Palette.blue} />
            <Text style={styles.quickChipText}>+250ml</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickChip}
            onPress={() => router.push('/weight/log')}
            activeOpacity={0.8}
          >
            <Ionicons name="scale" size={15} color={Palette.purple} />
            <Text style={styles.quickChipText}>Weight</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickChip, { borderColor: 'rgba(0, 245, 155, 0.3)', backgroundColor: 'rgba(0, 245, 155, 0.08)' }]}
            onPress={() => router.push('/ai/coach')}
            activeOpacity={0.8}
          >
            <Ionicons name="sparkles" size={15} color={Palette.primary} />
            <Text style={[styles.quickChipText, { color: Palette.primary }]}>AI Coach</Text>
          </TouchableOpacity>
        </View>

        {/* TODAY'S WORKOUT SPOTLIGHT */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Workout</Text>
          <TouchableOpacity onPress={() => router.push('/workouts')}>
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {todayWorkout ? (
          <Card variant="highlight" style={styles.workoutCompletedCard}>
            <View style={styles.workoutCompletedHeader}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={18} color={Palette.textInverse} />
              </View>
              <View style={styles.workoutCompletedInfo}>
                <Text style={styles.workoutDoneTitle}>{todayWorkout.routineName}</Text>
                <Text style={styles.workoutDoneSub}>
                  Completed • {Math.round(todayWorkout.durationSeconds / 60)} min • {todayWorkout.totalVolumeKg} kg volume
                </Text>
              </View>
            </View>
          </Card>
        ) : suggestedRoutine ? (
          <Card variant="default" style={styles.suggestedWorkoutCard}>
            <View style={styles.suggestedTopRow}>
              <View style={styles.suggestedLeft}>
                <Badge label={suggestedRoutine.category} variant="primary" size="sm" />
                <Text style={styles.suggestedTitle}>{suggestedRoutine.name}</Text>
                <Text style={styles.suggestedSub}>
                  {suggestedRoutine.exercises.length} exercises • ~{suggestedRoutine.estimatedMinutes} mins
                </Text>
              </View>
            </View>
            <Button
              title="Start Session"
              onPress={() => {
                startWorkout(suggestedRoutine);
                router.push('/workout/active');
              }}
              variant="primary"
              size="md"
              icon={<Ionicons name="play" size={16} color={Palette.textInverse} />}
              style={{ marginTop: Spacing.sm }}
            />
          </Card>
        ) : (
          <Card variant="default" style={styles.emptyWorkoutCard}>
            <Text style={styles.emptyWorkoutText}>No workout scheduled for today.</Text>
            <Button
              title="Browse Workouts"
              onPress={() => router.push('/workouts')}
              variant="secondary"
              size="sm"
            />
          </Card>
        )}

        {/* HYDRATION & BODY WEIGHT METRICS */}
        <View style={styles.twoColGrid}>
          {/* Hydration Card */}
          <Card variant="default" style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Ionicons name="water" size={18} color={Palette.blue} />
              <Text style={styles.metricCardLabel}>Hydration</Text>
            </View>
            <Text style={styles.metricValue}>
              {formatWater(currentWaterMl, settings.waterUnit)}
            </Text>
            <Text style={styles.metricSub}>
              Goal: {formatWater(profile.targetWaterMl, settings.waterUnit)}
            </Text>
            <View style={styles.waterBtnRow}>
              <TouchableOpacity
                onPress={() => addWater(250)}
                style={styles.waterAddMiniBtn}
              >
                <Text style={styles.waterAddMiniText}>+250</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addWater(500)}
                style={styles.waterAddMiniBtn}
              >
                <Text style={styles.waterAddMiniText}>+500</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Body Weight Card */}
          <Card
            variant="default"
            style={styles.metricCard}
            onPress={() => router.push('/weight/log')}
          >
            <View style={styles.metricHeader}>
              <Ionicons name="scale" size={18} color={Palette.purple} />
              <Text style={styles.metricCardLabel}>Weight</Text>
            </View>
            <Text style={styles.metricValue}>
              {formatWeight(profile.weightKg, settings.weightUnit)}
            </Text>
            <Text style={styles.metricSub}>
              {weightDelta <= 0
                ? 'Target Reached 🎉'
                : `${weightDelta} kg to target`}
            </Text>
            <View style={styles.weightActionRow}>
              <Text style={styles.logWeightText}>Tap to Log ➔</Text>
            </View>
          </Card>
        </View>

        {/* WEEKLY ACTIVITY */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Consistency</Text>
        </View>
        <Card variant="default" style={styles.weeklyCard}>
          <BarChart data={weeklyData} height={120} />
        </Card>
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
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
  },
  avatarBtn: {
    padding: Spacing.xxs,
  },
  heroEnergyCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macroDetailsCol: {
    flex: 1,
    marginLeft: Spacing.md,
    gap: 8,
  },
  macroItem: {},
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 1,
  },
  macroDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  macroName: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  macroValue: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  macroTarget: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.regular,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.full,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: 4,
  },
  quickChipText: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: -0.3,
  },
  sectionLink: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  suggestedWorkoutCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  suggestedTopRow: {
    marginBottom: Spacing.xs,
  },
  suggestedLeft: {
    alignItems: 'flex-start',
    gap: 4,
  },
  suggestedTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginTop: 4,
  },
  suggestedSub: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
  },
  workoutCompletedCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  workoutCompletedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutCompletedInfo: {
    flex: 1,
  },
  workoutDoneTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  workoutDoneSub: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
    marginTop: 2,
  },
  emptyWorkoutCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  emptyWorkoutText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  twoColGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metricCard: {
    flex: 1,
    padding: Spacing.md,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricCardLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  metricValue: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.black,
    marginTop: 2,
  },
  metricSub: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  waterBtnRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  waterAddMiniBtn: {
    flex: 1,
    backgroundColor: Palette.bgCardElevated,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  waterAddMiniText: {
    color: Palette.blue,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.bold,
  },
  weightActionRow: {
    marginTop: Spacing.sm,
  },
  logWeightText: {
    color: Palette.purple,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  weeklyCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
  },
});
