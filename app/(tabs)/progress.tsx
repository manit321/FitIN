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
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LineChart, DataPoint } from '../../components/charts/LineChart';
import { ActivityHeatmap } from '../../components/charts/ActivityHeatmap';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { TimeFilter } from '../../types';
import { formatWeight, formatDate } from '../../utils/formatters';

export default function ProgressScreen() {
  const router = useRouter();
  const { profile, settings, weightEntries, completedWorkouts, exercises } = useFitness();

  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');

  const timeFilterOptions: TimeFilter[] = ['7D', '30D', '3M', '6M', '1Y'];

  // Filter weight entries
  const now = new Date();
  const getFilterDays = (filter: TimeFilter): number => {
    switch (filter) {
      case '7D':
        return 7;
      case '30D':
        return 30;
      case '3M':
        return 90;
      case '6M':
        return 180;
      case '1Y':
        return 365;
    }
  };

  const cutoffDate = new Date(now.getTime() - getFilterDays(timeFilter) * 24 * 60 * 60 * 1000);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];

  const filteredWeightEntries = weightEntries
    .filter((w) => w.date >= cutoffStr)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const weightChartData: DataPoint[] = filteredWeightEntries.map((w) => ({
    label: w.date.substring(5), // MM-DD
    value: w.weightKg,
  }));

  // Volume chart data
  const filteredWorkouts = completedWorkouts
    .filter((w) => w.date >= cutoffStr)
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  const volumeChartData: DataPoint[] = filteredWorkouts.map((w) => ({
    label: w.date.substring(5),
    value: w.totalVolumeKg,
  }));

  // Exercises with PRs
  const exercisesWithPR = exercises
    .filter((e) => e.personalRecord && e.personalRecord.calculated1RM > 0)
    .sort((a, b) => ((b.personalRecord?.calculated1RM || 0) - (a.personalRecord?.calculated1RM || 0)));

  const startWeight = profile.startWeightKg;
  const currentWeight = profile.weightKg;
  const targetWeight = profile.targetWeightKg;
  const totalChange = Math.round((currentWeight - startWeight) * 10) / 10;
  const toGoal = Math.round((currentWeight - targetWeight) * 10) / 10;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AppHeader
          title="Analytics"
          subtitle="PROGRESS & BODY METRICS"
          rightAction={
            <TouchableOpacity
              onPress={() => router.push('/weight/log')}
              style={styles.logWeightBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="scale" size={15} color={Palette.textInverse} />
              <Text style={styles.logWeightBtnText}>Weigh-in</Text>
            </TouchableOpacity>
          }
        />

        {/* Apple-Style Time Filter Pills */}
        <View style={styles.timeFilterRow}>
          {timeFilterOptions.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setTimeFilter(f)}
              style={[
                styles.timeFilterBtn,
                timeFilter === f && styles.timeFilterBtnActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.timeFilterText,
                  timeFilter === f && styles.timeFilterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BODY WEIGHT TREND CARD */}
        <Card variant="elevated" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Body Weight Trend</Text>
              <Text style={styles.chartSubtitle}>
                Current: {formatWeight(currentWeight, settings.weightUnit)}
              </Text>
            </View>
            <Badge
              label={totalChange <= 0 ? `${totalChange} kg` : `+${totalChange} kg`}
              variant={totalChange <= 0 ? 'primary' : 'orange'}
              size="sm"
            />
          </View>

          {/* Weight Delta Summary */}
          <View style={styles.deltaBar}>
            <View style={styles.deltaItem}>
              <Text style={styles.deltaItemVal}>{startWeight} kg</Text>
              <Text style={styles.deltaItemLbl}>Start</Text>
            </View>
            <View style={styles.deltaItem}>
              <Text style={[styles.deltaItemVal, { color: Palette.primary }]}>
                {currentWeight} kg
              </Text>
              <Text style={styles.deltaItemLbl}>Current</Text>
            </View>
            <View style={styles.deltaItem}>
              <Text style={[styles.deltaItemVal, { color: Palette.purple }]}>
                {targetWeight} kg
              </Text>
              <Text style={styles.deltaItemLbl}>Target ({toGoal > 0 ? `${toGoal}kg left` : 'Done'})</Text>
            </View>
          </View>

          {/* SVG Line Chart */}
          <View style={styles.svgWrapper}>
            <LineChart
              data={weightChartData}
              color={Palette.primary}
              height={140}
              unit="kg"
            />
          </View>
        </Card>

        {/* WORKOUT VOLUME PROGRESSION */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Workout Volume</Text>
              <Text style={styles.chartSubtitle}>Weight lifted per session</Text>
            </View>
            <Badge label="Hypertrophy" variant="cyan" size="sm" />
          </View>

          <View style={styles.svgWrapper}>
            <LineChart
              data={volumeChartData}
              color={Palette.cyan}
              height={140}
              unit="kg"
            />
          </View>
        </Card>

        {/* 28-DAY CONSISTENCY HEATMAP */}
        <Card variant="default" style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>28-Day Consistency</Text>
              <Text style={styles.chartSubtitle}>Workout frequency matrix</Text>
            </View>
            <Badge label={`${completedWorkouts.length} sessions`} variant="primary" size="sm" />
          </View>

          <ActivityHeatmap completedWorkouts={completedWorkouts} />
        </Card>

        {/* PERSONAL RECORDS BOARD */}
        <Text style={styles.prBoardTitle}>🏆 Personal Records Showcase</Text>
        {exercisesWithPR.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            onPress={() => router.push(`/exercise/${ex.id}`)}
            activeOpacity={0.8}
          >
            <Card variant="default" style={styles.prCard}>
              <View style={styles.prLeft}>
                <Text style={styles.prExName}>{ex.name}</Text>
                <Text style={styles.prExSub}>
                  {ex.personalRecord?.weightKg} kg × {ex.personalRecord?.reps} reps • {formatDate(ex.personalRecord?.date || '')}
                </Text>
              </View>
              <View style={styles.prRight}>
                <Text style={styles.pr1RMVal}>{ex.personalRecord?.calculated1RM} kg</Text>
                <Text style={styles.pr1RMLbl}>1RM</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
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
  logWeightBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  logWeightBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
  },
  timeFilterRow: {
    flexDirection: 'row',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  timeFilterBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  timeFilterBtnActive: {
    backgroundColor: Palette.primary,
  },
  timeFilterText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  timeFilterTextActive: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.heavy,
  },
  chartCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  chartTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  chartSubtitle: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  deltaBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  deltaItem: {
    alignItems: 'center',
  },
  deltaItemVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  deltaItemLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    marginTop: 2,
  },
  svgWrapper: {
    marginTop: Spacing.xs,
  },
  prBoardTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  prCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    padding: Spacing.md,
  },
  prLeft: {
    flex: 1,
  },
  prExName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  prExSub: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  prRight: {
    alignItems: 'flex-end',
  },
  pr1RMVal: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  pr1RMLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
  },
});
