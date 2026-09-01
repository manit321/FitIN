import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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
import { calculate1RM } from '../../utils/calculations';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { exercises, startWorkout } = useFitness();

  const exercise = exercises.find((e) => e.id === id);

  const [calcWeight, setCalcWeight] = useState(
    exercise?.personalRecord?.weightKg ? String(exercise.personalRecord.weightKg) : '80'
  );
  const [calcReps, setCalcReps] = useState(
    exercise?.personalRecord?.reps ? String(exercise.personalRecord.reps) : '8'
  );

  if (!exercise) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.notFoundText}>Exercise not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const weightNum = parseFloat(calcWeight) || 0;
  const repsNum = parseInt(calcReps, 10) || 0;
  const estimated1RM = calculate1RM(weightNum, repsNum);

  const percentages = [
    { pct: 100, reps: '1 rep', weight: Math.round(estimated1RM) },
    { pct: 95, reps: '2 reps', weight: Math.round(estimated1RM * 0.95) },
    { pct: 90, reps: '3-4 reps', weight: Math.round(estimated1RM * 0.9) },
    { pct: 85, reps: '5-6 reps', weight: Math.round(estimated1RM * 0.85) },
    { pct: 80, reps: '7-8 reps', weight: Math.round(estimated1RM * 0.8) },
    { pct: 75, reps: '10 reps', weight: Math.round(estimated1RM * 0.75) },
    { pct: 70, reps: '12 reps', weight: Math.round(estimated1RM * 0.7) },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Detail</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO TITLE & BADGES */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="barbell" size={32} color={Palette.primary} />
          </View>
          <Text style={styles.exName}>{exercise.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={exercise.targetMuscle} variant="primary" size="sm" />
            <Badge label={exercise.equipment} variant="cyan" size="sm" />
            <Badge label={exercise.movementPattern} variant="orange" size="sm" />
            <Badge label={exercise.difficulty} variant="muted" size="sm" />
          </View>
        </Card>

        {/* PERSONAL RECORD CARD */}
        {exercise.personalRecord && (
          <Card variant="highlight" style={styles.prCard}>
            <View style={styles.prCardHeader}>
              <Ionicons name="trophy" size={22} color={Palette.amber} />
              <Text style={styles.prTitle}>Current Personal Record</Text>
            </View>
            <View style={styles.prStatsRow}>
              <View style={styles.prStatBox}>
                <Text style={styles.prStatVal}>
                  {exercise.personalRecord.weightKg} kg
                </Text>
                <Text style={styles.prStatLbl}>Weight</Text>
              </View>
              <View style={styles.prStatBox}>
                <Text style={styles.prStatVal}>{exercise.personalRecord.reps}</Text>
                <Text style={styles.prStatLbl}>Reps</Text>
              </View>
              <View style={styles.prStatBox}>
                <Text style={[styles.prStatVal, { color: Palette.amber }]}>
                  {exercise.personalRecord.calculated1RM} kg
                </Text>
                <Text style={styles.prStatLbl}>Calculated 1RM</Text>
              </View>
            </View>
            <Text style={styles.prDate}>
              Set on {formatDate(exercise.personalRecord.date)}
            </Text>
          </Card>
        )}

        {/* 1RM CALCULATOR */}
        <Card variant="default" style={styles.calcCard}>
          <View style={styles.calcHeader}>
            <Text style={styles.sectionTitle}>1-Rep Max Calculator</Text>
            <Ionicons name="calculator-outline" size={20} color={Palette.primary} />
          </View>

          <View style={styles.calcInputsRow}>
            <View style={styles.calcInputBox}>
              <Text style={styles.calcInputLabel}>Lifted Weight (kg)</Text>
              <TextInput
                style={styles.calcInput}
                keyboardType="decimal-pad"
                value={calcWeight}
                onChangeText={setCalcWeight}
              />
            </View>
            <View style={styles.calcInputBox}>
              <Text style={styles.calcInputLabel}>Reps Performed</Text>
              <TextInput
                style={styles.calcInput}
                keyboardType="number-pad"
                value={calcReps}
                onChangeText={setCalcReps}
              />
            </View>
          </View>

          {/* 1RM Result Banner */}
          <View style={styles.calcResultBanner}>
            <Text style={styles.calcResultLabel}>Estimated 1RM</Text>
            <Text style={styles.calcResultVal}>{estimated1RM} kg</Text>
          </View>

          {/* Percentage Chart */}
          <Text style={styles.pctHeader}>Percentage Breakdown</Text>
          <View style={styles.pctGrid}>
            {percentages.map((p, idx) => (
              <View key={idx} style={styles.pctRow}>
                <Text style={styles.pctName}>{p.pct}%</Text>
                <Text style={styles.pctReps}>{p.reps}</Text>
                <Text style={styles.pctWeight}>{p.weight} kg</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* INSTRUCTIONS */}
        <Card variant="default" style={styles.instructionsCard}>
          <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
          {exercise.instructions.map((step, idx) => (
            <View key={idx} style={styles.stepRow}>
              <View style={styles.stepNumCircle}>
                <Text style={styles.stepNumText}>{idx + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </Card>

        {/* PRO TIPS */}
        {exercise.tips && exercise.tips.length > 0 && (
          <Card variant="default" style={styles.tipsCard}>
            <Text style={styles.sectionTitle}>💡 Pro Hypertrophy Tips</Text>
            {exercise.tips.map((tip, idx) => (
              <Text key={idx} style={styles.tipText}>
                • {tip}
              </Text>
            ))}
          </Card>
        )}

        <Button
          title="Start Workout with this Exercise"
          onPress={() => {
            startWorkout([exercise], exercise.name);
            router.push('/workout/active');
          }}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Ionicons name="play" size={20} color={Palette.textInverse} />}
          style={{ marginTop: Spacing.md }}
        />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
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
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  exName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  prCard: {
    marginBottom: Spacing.md,
  },
  prCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  prTitle: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  prStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xs,
  },
  prStatBox: {
    alignItems: 'center',
  },
  prStatVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.black,
  },
  prStatLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  prDate: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    textAlign: 'right',
    marginTop: 4,
  },
  calcCard: {
    marginBottom: Spacing.md,
  },
  calcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.sm,
  },
  calcInputsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  calcInputBox: {
    flex: 1,
  },
  calcInputLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    marginBottom: 4,
  },
  calcInput: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    textAlign: 'center',
  },
  calcResultBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 155, 0.3)',
    marginBottom: Spacing.md,
  },
  calcResultLabel: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  calcResultVal: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
  },
  pctHeader: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  pctGrid: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  pctRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  pctName: {
    color: Palette.cyan,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    width: 45,
  },
  pctReps: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    flex: 1,
  },
  pctWeight: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  instructionsCard: {
    marginBottom: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  stepNumCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.bgCardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  stepText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    lineHeight: 20,
    flex: 1,
  },
  tipsCard: {
    marginBottom: Spacing.md,
  },
  tipText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
});
