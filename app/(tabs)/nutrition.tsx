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
import { MacroRings } from '../../components/charts/MacroRings';
import { MealSection } from '../../components/nutrition/MealSection';
import { WaterTrackerCard } from '../../components/nutrition/WaterTrackerCard';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/formatters';
import { MealCategory } from '../../types';

export default function NutritionScreen() {
  const router = useRouter();
  const {
    profile,
    settings,
    loggedMeals,
    waterLogs,
    deleteLoggedFood,
    addWater,
    setWater,
  } = useFitness();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter meals by date
  const dateMeals = loggedMeals.filter((m) => m.date === selectedDate);
  const breakfastItems = dateMeals.filter((m) => m.meal === 'breakfast');
  const lunchItems = dateMeals.filter((m) => m.meal === 'lunch');
  const dinnerItems = dateMeals.filter((m) => m.meal === 'dinner');
  const snackItems = dateMeals.filter((m) => m.meal === 'snacks');

  // Daily Totals
  const totalCalories = dateMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(dateMeals.reduce((acc, m) => acc + m.proteinG, 0) * 10) / 10;
  const totalCarbs = Math.round(dateMeals.reduce((acc, m) => acc + m.carbsG, 0) * 10) / 10;
  const totalFat = Math.round(dateMeals.reduce((acc, m) => acc + m.fatG, 0) * 10) / 10;
  const totalFiber = Math.round(dateMeals.reduce((acc, m) => acc + m.fiberG, 0) * 10) / 10;

  // Water Totals
  const dateWaterLogs = waterLogs.filter((w) => w.date === selectedDate);
  const currentWater = dateWaterLogs.reduce((acc, w) => acc + w.amountMl, 0);

  // Date Navigation
  const changeDate = (deltaDays: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + deltaDays);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  const handleOpenAddFood = (meal: MealCategory) => {
    router.push({
      pathname: '/nutrition/add-food',
      params: { meal, date: selectedDate },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        subtitle="NUTRITION & MACROS"
        title="Fuel & Macros"
        rightAction={
          <TouchableOpacity
            onPress={() => handleOpenAddFood('lunch')}
            style={styles.addFoodHeaderBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={Palette.textInverse} />
            <Text style={styles.addFoodHeaderBtnText}>Log Food</Text>
          </TouchableOpacity>
        }
      />

      {/* Date Switcher Bar */}
      <View style={styles.dateBar}>
        <TouchableOpacity
          onPress={() => changeDate(-1)}
          style={styles.dateArrow}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={Palette.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedDate(todayStr)}
          style={styles.dateCenter}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={16} color={Palette.primary} />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          {selectedDate === todayStr && (
            <View style={styles.todayIndicator}>
              <Text style={styles.todayText}>Today</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => changeDate(1)}
          style={styles.dateArrow}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color={Palette.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CALORIE & MACRO RINGS CARD */}
        <Card variant="elevated" style={styles.macroCard}>
          <View style={styles.macroRow}>
            <MacroRings
              size={150}
              consumedCalories={totalCalories}
              targetCalories={profile.targetCalories}
              proteinG={totalProtein}
              targetProteinG={profile.targetProteinG}
              carbsG={totalCarbs}
              targetCarbsG={profile.targetCarbsG}
              fatG={totalFat}
              targetFatG={profile.targetFatG}
            />

            <View style={styles.macroBars}>
              <ProgressBar
                label="Protein"
                current={totalProtein}
                target={profile.targetProteinG}
                unit="g"
                color={Palette.protein}
                height={6}
              />
              <ProgressBar
                label="Carbs"
                current={totalCarbs}
                target={profile.targetCarbsG}
                unit="g"
                color={Palette.carbs}
                height={6}
              />
              <ProgressBar
                label="Fat"
                current={totalFat}
                target={profile.targetFatG}
                unit="g"
                color={Palette.fat}
                height={6}
              />
              <ProgressBar
                label="Fiber"
                current={totalFiber}
                target={profile.targetFiberG}
                unit="g"
                color={Palette.fiber}
                height={6}
              />
            </View>
          </View>
        </Card>

        {/* MEAL SECTIONS */}
        <MealSection
          category="breakfast"
          items={breakfastItems}
          onAddFood={() => handleOpenAddFood('breakfast')}
          onDeleteItem={(id) => deleteLoggedFood(id)}
        />

        <MealSection
          category="lunch"
          items={lunchItems}
          onAddFood={() => handleOpenAddFood('lunch')}
          onDeleteItem={(id) => deleteLoggedFood(id)}
        />

        <MealSection
          category="dinner"
          items={dinnerItems}
          onAddFood={() => handleOpenAddFood('dinner')}
          onDeleteItem={(id) => deleteLoggedFood(id)}
        />

        <MealSection
          category="snacks"
          items={snackItems}
          onAddFood={() => handleOpenAddFood('snacks')}
          onDeleteItem={(id) => deleteLoggedFood(id)}
        />

        {/* WATER TRACKER */}
        <WaterTrackerCard
          currentWaterMl={currentWater}
          targetWaterMl={profile.targetWaterMl}
          waterUnit={settings.waterUnit}
          onAddWater={(amt) => addWater(amt, selectedDate)}
          onResetWater={() => setWater(0, selectedDate)}
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  addFoodHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cyan,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 4,
  },
  addFoodHeaderBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Palette.bgCard,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.md,
  },
  dateArrow: {
    padding: Spacing.xs,
  },
  dateCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  todayIndicator: {
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: 4,
  },
  todayText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.bold,
  },
  macroCard: {
    marginBottom: Spacing.md,
  },
  macroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  macroBars: {
    flex: 1,
    gap: 4,
  },
});
