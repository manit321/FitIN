import {
  FitnessGoal,
  ActivityLevel,
  Gender,
  WorkoutSet,
  CompletedWorkout,
} from '../types';

/**
 * Calculates estimated One-Rep Max using Epley formula.
 */
export function calculate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return Math.round(weightKg);
  return Math.round(weightKg * (1 + reps / 30));
}

/**
 * Calculates BMR using the Mifflin-St Jeor equation.
 */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'female' ? Math.round(base - 161) : Math.round(base + 5);
}

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.375));
}

/**
 * Calculates recommended daily targets based on biometrics and fitness goal.
 */
export function calculateNutritionTargets(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  fitnessGoal: FitnessGoal
) {
  const bmr = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);

  let targetCalories = tdee;
  let proteinPerKg = 2.0;
  let fatPerKg = 0.9;

  switch (fitnessGoal) {
    case 'lose_weight':
      targetCalories = Math.max(1300, Math.round(tdee - 500));
      proteinPerKg = 2.2;
      fatPerKg = 0.8;
      break;
    case 'build_muscle':
      targetCalories = Math.round(tdee + 300);
      proteinPerKg = 2.0;
      fatPerKg = 1.0;
      break;
    case 'increase_strength':
      targetCalories = Math.round(tdee + 150);
      proteinPerKg = 2.1;
      fatPerKg = 0.9;
      break;
    case 'improve_fitness':
    case 'increase_frequency':
    case 'maintain':
    default:
      targetCalories = tdee;
      proteinPerKg = 1.8;
      fatPerKg = 0.9;
      break;
  }

  const targetProteinG = Math.round(weightKg * proteinPerKg);
  const targetFatG = Math.round(weightKg * fatPerKg);

  const proteinCalories = targetProteinG * 4;
  const fatCalories = targetFatG * 9;
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const targetCarbsG = Math.round(remainingCalories / 4);
  const targetFiberG = Math.round((targetCalories / 1000) * 14);
  const targetWaterMl = Math.round(weightKg * 35 + 500);

  return {
    bmr,
    tdee,
    targetCalories,
    targetProteinG,
    targetCarbsG,
    targetFatG,
    targetFiberG,
    targetWaterMl,
  };
}

/**
 * Calculates total volume (kg) for an array of completed sets.
 */
export function calculateSetsVolume(sets: WorkoutSet[]): number {
  return sets.reduce((acc, set) => {
    if (set.isCompleted && set.weightKg > 0 && set.reps > 0) {
      return acc + set.weightKg * set.reps;
    }
    return acc;
  }, 0);
}

/**
 * Calculates streak count (consecutive active days).
 */
export function calculateStreak(
  workoutHistory: CompletedWorkout[],
  loggedDates: string[]
): number {
  const allActiveDates = new Set<string>();

  workoutHistory.forEach((w) => allActiveDates.add(w.date));
  loggedDates.forEach((d) => allActiveDates.add(d));

  if (allActiveDates.size === 0) return 0;

  const sortedDates = Array.from(allActiveDates).sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (!sortedDates.includes(today) && !sortedDates.includes(yesterday)) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(sortedDates.includes(today) ? today : yesterday);

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (sortedDates.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
