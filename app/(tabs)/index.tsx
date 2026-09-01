import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MacroRings } from '../../components/charts/MacroRings';
import { BarChart, BarDataPoint } from '../../components/charts/BarChart';
import { WaterTrackerCard } from '../../components/nutrition/WaterTrackerCard';
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
    weightEntries,
    startWorkout,
    addWater,
    setWater,
  } = useFitness();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate today's nutrition totals
  const todayMeals = loggedMeals.filter((m) => m.date === todayStr);
  const consumedCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = Math.round(todayMeals.reduce((acc, m) => acc + m.proteinG, 0) * 10) / 10;
  const consumedCarbs = Math.round(todayMeals.reduce((acc, m) => acc + m.carbsG, 0) * 10) / 10;
  const consumedFat = Math.round(todayMeals.reduce((acc, m) => acc + m.fatG, 0) * 10) / 10;

  // Calculate today's water
  const todayWaterLogs = waterLogs.filter((w) => w.date === todayStr);
  const currentWaterMl = todayWaterLogs.reduce((acc, w) => acc + w.amountMl, 0);

  // Check if today has a completed workout
  const todayWorkout = completedWorkouts.find((w) => w.date === todayStr);

  // Suggested routine for today
  const suggestedRoutine = routines.length > 0 ? routines[0] : null;

  // Calculate current streak
  const loggedDates = Array.from(new Set(loggedMeals.map((m) => m.date)));
  const streak = calculateStreak(completedWorkouts, loggedDates);

  // Weekly workout data for BarChart
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = new Date();
  const currentDayIndex = (todayDate.getDay() + 6) % 7; // 0 for Monday

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

  // Recent Weight
  const currentWeight = profile.weightKg;
  const targetWeight = profile.targetWeightKg;
  const startWeight = profile.startWeightKg;
  const weightChange = Math.round((currentWeight - startWeight) * 10) / 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Header */}
        <AppHeader
          subtitle={formatFullDate()}
          title={`Hey, ${profile.name.split(' ')[0]} 👋`}
          streakDays={streak}
          rightAction={
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={styles.profileAvatarBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="person-circle" size={38} color={Palette.primary} />
            </TouchableOpacity>
          }
        />

        {/* QUICK ACTIONS ROW */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: 'rgba(0, 245, 155, 0.1)' }]}
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
            <View style={[styles.quickActionIcon, { backgroundColor: Palette.primary }]}>
              <Ionicons name="play" size={18} color={Palette.textInverse} />
            </View>
            <Text style={styles.quickActionTitle}>Start Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: 'rgba(0, 210, 255, 0.1)' }]}
            onPress={() => router.push('/nutrition/add-food')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Palette.cyan }]}>
              <Ionicons name="restaurant" size={18} color={Palette.textInverse} />
            </View>
            <Text style={styles.quickActionTitle}>Log Food</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: 'rgba(56, 189, 248, 0.1)' }]}
            onPress={() => addWater(250)}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Palette.water }]}>
              <Ionicons name="water" size={18} color={Palette.textInverse} />
            </View>
            <Text style={styles.quickActionTitle}>+250ml Water</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionCard, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}
            onPress={() => router.push('/weight/log')}
            activeOpacity={0.8}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: Palette.amber }]}>
              <Ionicons name="scale" size={18} color={Palette.textInverse} />
            </View>
            <Text style={styles.quickActionTitle}>Log Weight</Text>
          </TouchableOpacity>
        </View>

        {/* NUTRITION & CALORIE SUMMARY CARD */}
        <Card variant="elevated" style={styles.macroDashboardCard}>
          <View style={styles.macroCardHeader}>
            <View>
              <Text style={styles.sectionHeading}>Daily Nutrition</Text>
              <Text style={styles.sectionSubheading}>Target: {profile.targetCalories} kcal</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/nutrition')}
              style={styles.detailsLink}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsLinkText}>View Meals</Text>
              <Ionicons name="chevron-forward" size={14} color={Palette.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.macroDashboardBody}>
            {/* Concentric Rings */}
            <MacroRings
              size={160}
              consumedCalories={consumedCalories}
              targetCalories={profile.targetCalories}
              proteinG={consumedProtein}
              targetProteinG={profile.targetProteinG}
              carbsG={consumedCarbs}
              targetCarbsG={profile.targetCarbsG}
              fatG={consumedFat}
              targetFatG={profile.targetFatG}
            />

            {/* Macro Progress Bars */}
            <View style={styles.macroBarsColumn}>
              <ProgressBar
                label="Protein"
                current={consumedProtein}
                target={profile.targetProteinG}
                unit="g"
                color={Palette.protein}
                height={6}
              />
              <ProgressBar
                label="Carbs"
                current={consumedCarbs}
                target={profile.targetCarbsG}
                unit="g"
                color={Palette.carbs}
                height={6}
              />
              <ProgressBar
                label="Fat"
                current={consumedFat}
                target={profile.targetFatG}
                unit="g"
                color={Palette.fat}
                height={6}
              />
            </View>
          </View>
        </Card>

        {/* TODAY'S WORKOUT SPOTLIGHT */}
        <Card variant="default" style={styles.workoutSpotlightCard}>
          <View style={styles.spotlightHeader}>
            <View style={styles.spotlightTitleRow}>
              <View style={styles.spotlightIcon}>
                <Ionicons name="flame" size={22} color={Palette.orange} />
              </View>
              <View>
                <Text style={styles.spotlightCategory}>
                  {todayWorkout ? 'TODAY COMPLETED' : 'UP NEXT'}
                </Text>
                <Text style={styles.spotlightRoutineName}>
                  {todayWorkout
                    ? todayWorkout.routineName
                    : suggestedRoutine?.name || 'Full Body Workout'}
                </Text>
              </View>
            </View>

            {todayWorkout && (
              <Badge label="Finished" variant="success" size="sm" />
            )}
          </View>

          {todayWorkout ? (
            <View style={styles.completedWorkoutSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {Math.round(todayWorkout.durationSeconds / 60)}m
                </Text>
                <Text style={styles.summaryLabel}>Duration</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {todayWorkout.totalVolumeKg}kg
                </Text>
                <Text style={styles.summaryLabel}>Volume</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {todayWorkout.totalSetsCompleted}
                </Text>
                <Text style={styles.summaryLabel}>Sets Done</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>
                  {todayWorkout.caloriesBurned}
                </Text>
                <Text style={styles.summaryLabel}>Burned</Text>
              </View>
            </View>
          ) : suggestedRoutine ? (
            <View style={styles.suggestedRoutineInfo}>
              <Text style={styles.suggestedDesc} numberOfLines={2}>
                {suggestedRoutine.description}
              </Text>
              <View style={styles.routineMetaPills}>
                <Badge
                  label={`${suggestedRoutine.exercises.length} Exercises`}
                  variant="muted"
                  size="sm"
                />
                <Badge
                  label={`${suggestedRoutine.estimatedMinutes} Mins`}
                  variant="muted"
                  size="sm"
                />
                <Badge
                  label={suggestedRoutine.difficulty}
                  variant="cyan"
                  size="sm"
                />
              </View>
              <Button
                title="Start Workout"
                onPress={() => {
                  startWorkout(suggestedRoutine);
                  router.push('/workout/active');
                }}
                variant="primary"
                fullWidth
                icon={<Ionicons name="play" size={18} color={Palette.textInverse} />}
                style={styles.startWorkoutBtn}
              />
            </View>
          ) : null}
        </Card>

        {/* WATER TRACKER */}
        <WaterTrackerCard
          currentWaterMl={currentWaterMl}
          targetWaterMl={profile.targetWaterMl}
          waterUnit={settings.waterUnit}
          onAddWater={(amt) => addWater(amt)}
          onResetWater={() => setWater(0)}
        />

        {/* BODY WEIGHT PROGRESS SUMMARY */}
        <Card variant="default" style={styles.weightCard}>
          <View style={styles.weightHeader}>
            <View>
              <Text style={styles.weightCardTitle}>Body Weight</Text>
              <Text style={styles.weightCardSubtitle}>Target: {targetWeight} kg</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/weight/log')}
              style={styles.logWeightBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={Palette.primary} />
              <Text style={styles.logWeightBtnText}>Log Weight</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weightStatsGrid}>
            <View style={styles.weightStatBox}>
              <Text style={styles.weightStatValue}>
                {formatWeight(currentWeight, settings.weightUnit)}
              </Text>
              <Text style={styles.weightStatLabel}>Current</Text>
            </View>
            <View style={styles.weightStatBox}>
              <Text
                style={[
                  styles.weightStatValue,
                  { color: weightChange <= 0 ? Palette.success : Palette.warning },
                ]}
              >
                {weightChange > 0 ? `+${weightChange}` : weightChange} kg
              </Text>
              <Text style={styles.weightStatLabel}>Change</Text>
            </View>
            <View style={styles.weightStatBox}>
              <Text style={styles.weightStatValue}>
                {formatWeight(targetWeight, settings.weightUnit)}
              </Text>
              <Text style={styles.weightStatLabel}>Goal</Text>
            </View>
          </View>
        </Card>

        {/* WEEKLY ACTIVITY OVERVIEW */}
        <Card variant="default" style={styles.weeklyCard}>
          <View style={styles.weeklyHeader}>
            <Text style={styles.weeklyTitle}>Weekly Consistency</Text>
            <TouchableOpacity
              onPress={() => router.push('/progress')}
              style={styles.detailsLink}
              activeOpacity={0.7}
            >
              <Text style={styles.detailsLinkText}>Analytics</Text>
              <Ionicons name="chevron-forward" size={14} color={Palette.primary} />
            </TouchableOpacity>
          </View>
          <BarChart
            data={weeklyData}
            height={140}
            unit="%"
            barColor="rgba(0, 245, 155, 0.3)"
            activeBarColor={Palette.primary}
          />
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
    paddingBottom: Spacing.xxxl,
  },
  profileAvatarBtn: {
    padding: 2,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickActionCard: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
  },
  macroDashboardCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  macroCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionHeading: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
  sectionSubheading: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailsLinkText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  macroDashboardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  macroBarsColumn: {
    flex: 1,
    gap: 6,
  },
  workoutSpotlightCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  spotlightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  spotlightTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  spotlightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotlightCategory: {
    color: Palette.orange,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.8,
  },
  spotlightRoutineName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  completedWorkoutSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginTop: Spacing.xs,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  summaryLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  suggestedRoutineInfo: {
    marginTop: Spacing.xs,
  },
  suggestedDesc: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  routineMetaPills: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: Spacing.md,
  },
  startWorkoutBtn: {
    marginTop: Spacing.xs,
  },
  weightCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  weightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  weightCardTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
  weightCardSubtitle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  logWeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: 4,
  },
  logWeightBtnText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  weightStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  weightStatBox: {
    alignItems: 'center',
  },
  weightStatValue: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
  },
  weightStatLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  weeklyCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  weeklyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weeklyTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
});
