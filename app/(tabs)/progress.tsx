import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Card } from '../../components/ui/Card';
import { LineChart, DataPoint } from '../../components/charts/LineChart';
import { BarChart, BarDataPoint } from '../../components/charts/BarChart';
import { ActivityHeatmap } from '../../components/charts/ActivityHeatmap';
import { Badge } from '../../components/ui/Badge';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatWeight, formatDate } from '../../utils/formatters';
import { TimeFilter } from '../../types';

export default function ProgressScreen() {
  const router = useRouter();
  const {
    profile,
    settings,
    weightEntries,
    completedWorkouts,
    exercises,
    loggedMeals,
  } = useFitness();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');

  const timeFilterOptions: { label: string; value: TimeFilter }[] = [
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' },
    { label: '3M', value: '3M' },
    { label: '6M', value: '6M' },
    { label: '1Y', value: '1Y' },
  ];

  // Weight Trend Data Points
  const weightDataPoints: DataPoint[] = weightEntries.map((w) => ({
    label: formatDate(w.date),
    value: w.weightKg,
    date: w.date,
  }));

  // Volume Trend Data Points
  const volumeDataPoints: DataPoint[] = completedWorkouts
    .slice()
    .reverse()
    .map((w) => ({
      label: formatDate(w.date),
      value: w.totalVolumeKg,
      date: w.date,
    }));

  // Calorie consistency
  const calorieBars: BarDataPoint[] = loggedMeals
    .slice(0, 7)
    .reverse()
    .map((m) => ({
      label: formatDate(m.date),
      value: m.calories,
    }));

  // Personal Records List
  const prExercises = exercises.filter((e) => e.personalRecord !== undefined);

  // Overall Stats
  const totalVolumeLifetime = completedWorkouts.reduce(
    (acc, w) => acc + w.totalVolumeKg,
    0
  );
  const totalWorkoutsCount = completedWorkouts.length;
  const totalCaloriesBurned = completedWorkouts.reduce(
    (acc, w) => acc + w.caloriesBurned,
    0
  );

  const startWeight = profile.startWeightKg;
  const currentWeight = profile.weightKg;
  const goalWeight = profile.targetWeightKg;
  const weightChange = Math.round((currentWeight - startWeight) * 10) / 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        subtitle="ANALYTICS & STATS"
        title="Progress"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/weight/log')}
            style={styles.logWeightHeaderBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color={Palette.textInverse} />
            <Text style={styles.logWeightHeaderBtnText}>Log Weight</Text>
          </TouchableOpacity>
        }
      />

      {/* Time Range Filter */}
      <View style={styles.filterContainer}>
        <SegmentedControl
          options={timeFilterOptions}
          selectedValue={timeFilter}
          onSelect={(val) => setTimeFilter(val)}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* LIFETIME STATS SUMMARY CARDS */}
        <View style={styles.statsGrid}>
          <Card variant="elevated" style={styles.miniStatCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(0, 245, 155, 0.15)' }]}>
              <Ionicons name="barbell" size={20} color={Palette.primary} />
            </View>
            <Text style={styles.miniStatValue}>{totalWorkoutsCount}</Text>
            <Text style={styles.miniStatLabel}>Workouts</Text>
          </Card>

          <Card variant="elevated" style={styles.miniStatCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(0, 210, 255, 0.15)' }]}>
              <Ionicons name="trophy" size={20} color={Palette.cyan} />
            </View>
            <Text style={styles.miniStatValue}>
              {Math.round(totalVolumeLifetime / 1000)}k
            </Text>
            <Text style={styles.miniStatLabel}>Vol (kg)</Text>
          </Card>

          <Card variant="elevated" style={styles.miniStatCard}>
            <View style={[styles.statIconCircle, { backgroundColor: 'rgba(255, 107, 0, 0.15)' }]}>
              <Ionicons name="flame" size={20} color={Palette.orange} />
            </View>
            <Text style={styles.miniStatValue}>
              {Math.round(totalCaloriesBurned / 1000)}k
            </Text>
            <Text style={styles.miniStatLabel}>Calories</Text>
          </Card>
        </View>

        {/* BODY WEIGHT PROGRESSION CHART */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.chartTitle}>Weight Progression</Text>
              <Text style={styles.chartSubtitle}>
                Current: {formatWeight(currentWeight, settings.weightUnit)} (
                {weightChange > 0 ? `+${weightChange}` : weightChange} kg)
              </Text>
            </View>
            <Badge
              label={`Goal: ${goalWeight} kg`}
              variant="primary"
              size="sm"
            />
          </View>

          <LineChart
            data={weightDataPoints}
            height={190}
            unit={settings.weightUnit}
            color={Palette.primary}
          />
        </Card>

        {/* WORKOUT VOLUME PROGRESSION CHART */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.chartTitle}>Workout Volume</Text>
              <Text style={styles.chartSubtitle}>Total kg lifted per session</Text>
            </View>
            <Badge label="Progressive Overload" variant="cyan" size="sm" />
          </View>

          <LineChart
            data={volumeDataPoints}
            height={190}
            unit="kg"
            color={Palette.cyan}
            gradientFrom={Palette.cyan}
            gradientTo="rgba(0, 210, 255, 0)"
          />
        </Card>

        {/* 28-DAY WORKOUT CONSISTENCY HEATMAP */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.chartTitle}>Activity Consistency</Text>
              <Text style={styles.chartSubtitle}>4-week workout frequency</Text>
            </View>
          </View>

          <ActivityHeatmap completedWorkouts={completedWorkouts} />
        </Card>

        {/* PERSONAL RECORDS SHOWCASE */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartCardHeader}>
            <View>
              <Text style={styles.chartTitle}>Personal Records (PR)</Text>
              <Text style={styles.chartSubtitle}>Estimated 1-Rep Maximums</Text>
            </View>
            <Ionicons name="trophy" size={22} color={Palette.amber} />
          </View>

          <View style={styles.prList}>
            {prExercises.map((ex) => (
              <View key={ex.id} style={styles.prRow}>
                <View style={styles.prExInfo}>
                  <Text style={styles.prExName}>{ex.name}</Text>
                  <Text style={styles.prExDetail}>
                    {ex.personalRecord?.weightKg}kg × {ex.personalRecord?.reps} reps (
                    {formatDate(ex.personalRecord?.date || '')})
                  </Text>
                </View>
                <View style={styles.pr1RMBadge}>
                  <Text style={styles.pr1RMVal}>
                    {ex.personalRecord?.calculated1RM}
                  </Text>
                  <Text style={styles.pr1RMLabel}>1RM kg</Text>
                </View>
              </View>
            ))}
          </View>
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
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  logWeightHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.amber,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 4,
  },
  logWeightHeaderBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  miniStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  miniStatValue: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.black,
  },
  miniStatLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  chartCard: {
    marginBottom: Spacing.md,
  },
  chartCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  chartTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
  chartSubtitle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  prList: {
    marginTop: Spacing.xs,
  },
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  prExInfo: {
    flex: 1,
  },
  prExName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  prExDetail: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  pr1RMBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  pr1RMVal: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
  },
  pr1RMLabel: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.semibold,
  },
});
