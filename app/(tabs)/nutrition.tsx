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
import { ProgressBar } from '../../components/ui/ProgressBar';
import { MealSection } from '../../components/nutrition/MealSection';
import { WaterTrackerCard } from '../../components/nutrition/WaterTrackerCard';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { MealCategory } from '../../types';

export default function NutritionScreen() {
  const router = useRouter();
  const { profile, settings, loggedMeals, waterLogs, deleteLoggedFood, addWater, setWater } =
    useFitness();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const handleDateShift = (deltaDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + deltaDays);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const dayMeals = loggedMeals.filter((m) => m.date === selectedDate);
  const totalCalories = dayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(dayMeals.reduce((acc, m) => acc + m.proteinG, 0) * 10) / 10;
  const totalCarbs = Math.round(dayMeals.reduce((acc, m) => acc + m.carbsG, 0) * 10) / 10;
  const totalFat = Math.round(dayMeals.reduce((acc, m) => acc + m.fatG, 0) * 10) / 10;
  const totalFiber = Math.round(dayMeals.reduce((acc, m) => acc + (m.fiberG || 0), 0) * 10) / 10;

  const dayWater = waterLogs
    .filter((w) => w.date === selectedDate)
    .reduce((acc, w) => acc + w.amountMl, 0);

  const remainingCalories = profile.targetCalories - totalCalories;

  const isToday = selectedDate === todayStr;

  const mealCategories: MealCategory[] = [
    'breakfast',
    'lunch',
    'dinner',
    'snacks',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AppHeader
          title="Nutrition"
          subtitle="DAILY MACROS & MEALS"
          rightAction={
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/nutrition/add-food', params: { date: selectedDate } })}
              style={styles.logFoodBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color={Palette.textInverse} />
              <Text style={styles.logFoodBtnText}>Log</Text>
            </TouchableOpacity>
          }
        />

        {/* Date Selector Navigation Bar */}
        <View style={styles.dateNavRow}>
          <TouchableOpacity onPress={() => handleDateShift(-1)} style={styles.dateNavBtn}>
            <Ionicons name="chevron-back" size={18} color={Palette.textPrimary} />
          </TouchableOpacity>
          <View style={styles.dateCenter}>
            <Text style={styles.dateTitle}>
              {isToday ? 'Today' : selectedDate}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleDateShift(1)}
            style={styles.dateNavBtn}
            disabled={isToday}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={isToday ? Palette.textDisabled : Palette.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* CALORIE BUDGET HERO CARD */}
        <Card variant="elevated" style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetBigVal}>
                {remainingCalories >= 0 ? remainingCalories : 0}
              </Text>
              <Text style={styles.budgetBigLabel}>KCAL REMAINING</Text>
            </View>
            <View style={styles.budgetSummaryCol}>
              <Text style={styles.budgetSummaryText}>
                Target: <Text style={{ color: Palette.textPrimary, fontWeight: '700' }}>{profile.targetCalories}</Text>
              </Text>
              <Text style={styles.budgetSummaryText}>
                Food: <Text style={{ color: Palette.calories, fontWeight: '700' }}>{totalCalories}</Text>
              </Text>
            </View>
          </View>

          {/* Macro Progress Breakdown */}
          <View style={styles.macroProgressGrid}>
            <ProgressBar
              current={totalProtein}
              target={profile.targetProteinG}
              label="Protein"
              unit="g"
              color={Palette.protein}
              height={7}
            />
            <ProgressBar
              current={totalCarbs}
              target={profile.targetCarbsG}
              label="Carbs"
              unit="g"
              color={Palette.carbs}
              height={7}
            />
            <ProgressBar
              current={totalFat}
              target={profile.targetFatG}
              label="Fat"
              unit="g"
              color={Palette.fat}
              height={7}
            />
            <ProgressBar
              current={totalFiber}
              target={profile.targetFiberG}
              label="Fiber"
              unit="g"
              color={Palette.fiber}
              height={7}
            />
          </View>
        </Card>

        {/* WATER TRACKER CARD */}
        <WaterTrackerCard
          currentWaterMl={dayWater}
          targetWaterMl={profile.targetWaterMl}
          waterUnit={settings.waterUnit}
          onAddWater={(ml: number) => addWater(ml, selectedDate)}
          onResetWater={() => setWater(0, selectedDate)}
        />

        {/* MEAL SECTIONS */}
        <Text style={styles.mealsHeading}>Daily Meals</Text>
        {mealCategories.map((category) => {
          const mealsInCategory = dayMeals.filter((item) => item.meal === category);
          return (
            <MealSection
              key={category}
              category={category}
              items={mealsInCategory}
              onAddFood={() =>
                router.push({
                  pathname: '/nutrition/add-food',
                  params: { meal: category, date: selectedDate },
                })
              }
              onDeleteItem={(id: string) => deleteLoggedFood(id)}
            />
          );
        })}
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
  logFoodBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  logFoodBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
  },
  dateNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  dateNavBtn: {
    padding: Spacing.xs,
  },
  dateCenter: {
    alignItems: 'center',
  },
  dateTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  budgetCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  budgetBigVal: {
    color: Palette.textPrimary,
    fontSize: 36,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -0.5,
  },
  budgetBigLabel: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.8,
  },
  budgetSummaryCol: {
    alignItems: 'flex-end',
    gap: 2,
    marginTop: 4,
  },
  budgetSummaryText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
  },
  macroProgressGrid: {
    gap: Spacing.sm,
  },
  mealsHeading: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
});
