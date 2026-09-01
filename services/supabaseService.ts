import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  UserProfile,
  Exercise,
  WorkoutRoutine,
  CompletedWorkout,
  FoodItem,
  LoggedFoodItem,
  WaterLog,
  WeightEntry,
} from '../types';

export const SupabaseService = {
  // Profiles
  async fetchProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data) return null;

      return {
        id: data.id,
        name: data.name,
        gender: data.gender,
        age: data.age,
        heightCm: data.height_cm,
        weightKg: data.weight_kg,
        startWeightKg: data.start_weight_kg,
        targetWeightKg: data.target_weight_kg,
        activityLevel: data.activity_level,
        fitnessGoal: data.fitness_goal,
        trainingDaysGoal: data.training_days_goal,
        bmr: data.bmr,
        tdee: data.tdee,
        targetCalories: data.target_calories,
        targetProteinG: data.target_protein_g,
        targetCarbsG: data.target_carbs_g,
        targetFatG: data.target_fat_g,
        targetFiberG: data.target_fiber_g,
        targetWaterMl: data.target_water_ml,
        isManualMacroOverride: data.is_manual_macro_override,
        isOnboarded: data.is_onboarded,
        createdAt: data.created_at,
      };
    } catch (e) {
      console.warn('Supabase fetchProfile error:', e);
      return null;
    }
  },

  async upsertProfile(profile: UserProfile): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('profiles').upsert({
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        age: profile.age,
        height_cm: profile.heightCm,
        weight_kg: profile.weightKg,
        start_weight_kg: profile.startWeightKg,
        target_weight_kg: profile.targetWeightKg,
        activity_level: profile.activityLevel,
        fitness_goal: profile.fitnessGoal,
        training_days_goal: profile.trainingDaysGoal,
        bmr: profile.bmr,
        tdee: profile.tdee,
        target_calories: profile.targetCalories,
        target_protein_g: profile.targetProteinG,
        target_carbs_g: profile.targetCarbsG,
        target_fat_g: profile.targetFatG,
        target_fiber_g: profile.targetFiberG,
        target_water_ml: profile.targetWaterMl,
        is_manual_macro_override: profile.isManualMacroOverride,
        is_onboarded: profile.isOnboarded,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase upsertProfile error:', e);
    }
  },

  // Exercises
  async fetchExercises(): Promise<Exercise[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase.from('exercises').select('*');
      if (error || !data || data.length === 0) return null;

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        targetMuscle: d.target_muscle,
        secondaryMuscles: d.secondary_muscles || [],
        equipment: d.equipment,
        movementPattern: d.movement_pattern,
        difficulty: d.difficulty,
        instructions: d.instructions || [],
        tips: d.tips || [],
        isCustom: d.is_custom,
        personalRecord: d.personal_record,
      }));
    } catch (e) {
      console.warn('Supabase fetchExercises error:', e);
      return null;
    }
  },

  async upsertExercise(exercise: Exercise): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('exercises').upsert({
        id: exercise.id,
        name: exercise.name,
        target_muscle: exercise.targetMuscle,
        secondary_muscles: exercise.secondaryMuscles,
        equipment: exercise.equipment,
        movement_pattern: exercise.movementPattern,
        difficulty: exercise.difficulty,
        instructions: exercise.instructions,
        tips: exercise.tips,
        is_custom: exercise.isCustom,
        personal_record: exercise.personalRecord,
      });
    } catch (e) {
      console.warn('Supabase upsertExercise error:', e);
    }
  },

  // Routines
  async fetchRoutines(userId: string): Promise<WorkoutRoutine[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .or(`user_id.eq.${userId},is_custom.eq.false`);

      if (error || !data || data.length === 0) return null;

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        category: d.category,
        exercises: d.exercises || [],
        estimatedMinutes: d.estimated_minutes,
        difficulty: d.difficulty,
        tags: d.tags || [],
        isCustom: d.is_custom,
        lastPerformedDate: d.last_performed_date,
        timesCompleted: d.times_completed,
      }));
    } catch (e) {
      console.warn('Supabase fetchRoutines error:', e);
      return null;
    }
  },

  async upsertRoutine(routine: WorkoutRoutine, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('routines').upsert({
        id: routine.id,
        user_id: userId,
        name: routine.name,
        description: routine.description,
        category: routine.category,
        exercises: routine.exercises,
        estimated_minutes: routine.estimatedMinutes,
        difficulty: routine.difficulty,
        tags: routine.tags,
        is_custom: routine.isCustom,
        last_performed_date: routine.lastPerformedDate,
        times_completed: routine.timesCompleted,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase upsertRoutine error:', e);
    }
  },

  async deleteRoutine(routineId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('routines').delete().eq('id', routineId);
    } catch (e) {
      console.warn('Supabase deleteRoutine error:', e);
    }
  },

  // Completed Workouts
  async fetchCompletedWorkouts(userId: string): Promise<CompletedWorkout[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('completed_workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error || !data) return null;

      return data.map((d) => ({
        id: d.id,
        routineId: d.routine_id,
        routineName: d.routine_name,
        startTime: d.start_time,
        endTime: d.end_time,
        date: d.date,
        durationSeconds: d.duration_seconds,
        totalVolumeKg: d.total_volume_kg,
        totalSetsCompleted: d.total_sets_completed,
        totalRepsCompleted: d.total_reps_completed,
        caloriesBurned: d.calories_burned,
        exercises: d.exercises || [],
        notes: d.notes,
        personalRecordsBroken: d.personal_records_broken || [],
      }));
    } catch (e) {
      console.warn('Supabase fetchCompletedWorkouts error:', e);
      return null;
    }
  },

  async upsertCompletedWorkout(
    workout: CompletedWorkout,
    userId: string
  ): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('completed_workouts').upsert({
        id: workout.id,
        user_id: userId,
        routine_id: workout.routineId,
        routine_name: workout.routineName,
        start_time: workout.startTime,
        end_time: workout.endTime,
        date: workout.date,
        duration_seconds: workout.durationSeconds,
        total_volume_kg: workout.totalVolumeKg,
        total_sets_completed: workout.totalSetsCompleted,
        total_reps_completed: workout.totalRepsCompleted,
        calories_burned: workout.caloriesBurned,
        exercises: workout.exercises,
        notes: workout.notes,
        personal_records_broken: workout.personalRecordsBroken,
      });
    } catch (e) {
      console.warn('Supabase upsertCompletedWorkout error:', e);
    }
  },

  async deleteCompletedWorkout(workoutId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('completed_workouts').delete().eq('id', workoutId);
    } catch (e) {
      console.warn('Supabase deleteCompletedWorkout error:', e);
    }
  },

  // Foods Catalog
  async fetchFoods(userId: string): Promise<FoodItem[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .or(`user_id.eq.${userId},is_custom.eq.false`);

      if (error || !data || data.length === 0) return null;

      return data.map((d) => ({
        id: d.id,
        name: d.name,
        brand: d.brand,
        category: d.category,
        servingSize: d.serving_size,
        servingUnit: d.serving_unit,
        baseServingQty: d.base_serving_qty,
        calories: d.calories,
        proteinG: d.protein_g,
        carbsG: d.carbs_g,
        fatG: d.fat_g,
        fiberG: d.fiber_g,
        isVegetarian: d.is_vegetarian,
        isVegan: d.is_vegan,
        isIndianRegional: d.is_indian_regional,
        isCustom: d.is_custom,
      }));
    } catch (e) {
      console.warn('Supabase fetchFoods error:', e);
      return null;
    }
  },

  async upsertFood(food: FoodItem, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('foods').upsert({
        id: food.id,
        user_id: userId,
        name: food.name,
        brand: food.brand,
        category: food.category,
        serving_size: food.servingSize,
        serving_unit: food.servingUnit,
        base_serving_qty: food.baseServingQty,
        calories: food.calories,
        protein_g: food.proteinG,
        carbs_g: food.carbsG,
        fat_g: food.fatG,
        fiber_g: food.fiberG,
        is_vegetarian: food.isVegetarian,
        is_vegan: food.isVegan,
        is_indian_regional: food.isIndianRegional,
        is_custom: food.isCustom,
      });
    } catch (e) {
      console.warn('Supabase upsertFood error:', e);
    }
  },

  // Logged Meals
  async fetchLoggedMeals(userId: string): Promise<LoggedFoodItem[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('logged_meals')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error || !data) return null;

      return data.map((d) => ({
        id: d.id,
        foodId: d.food_id,
        name: d.name,
        meal: d.meal,
        date: d.date,
        servings: d.servings,
        servingUnit: d.serving_unit,
        calories: d.calories,
        proteinG: d.protein_g,
        carbsG: d.carbs_g,
        fatG: d.fat_g,
        fiberG: d.fiber_g,
        timestamp: d.timestamp,
      }));
    } catch (e) {
      console.warn('Supabase fetchLoggedMeals error:', e);
      return null;
    }
  },

  async upsertLoggedMeal(
    meal: LoggedFoodItem,
    userId: string
  ): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('logged_meals').upsert({
        id: meal.id,
        user_id: userId,
        food_id: meal.foodId,
        name: meal.name,
        meal: meal.meal,
        date: meal.date,
        servings: meal.servings,
        serving_unit: meal.servingUnit,
        calories: meal.calories,
        protein_g: meal.proteinG,
        carbs_g: meal.carbsG,
        fat_g: meal.fatG,
        fiber_g: meal.fiberG,
        timestamp: meal.timestamp,
      });
    } catch (e) {
      console.warn('Supabase upsertLoggedMeal error:', e);
    }
  },

  async deleteLoggedMeal(mealId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('logged_meals').delete().eq('id', mealId);
    } catch (e) {
      console.warn('Supabase deleteLoggedMeal error:', e);
    }
  },

  // Water Logs
  async fetchWaterLogs(userId: string): Promise<WaterLog[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error || !data) return null;

      return data.map((d) => ({
        id: d.id,
        date: d.date,
        amountMl: d.amount_ml,
        timestamp: d.timestamp,
      }));
    } catch (e) {
      console.warn('Supabase fetchWaterLogs error:', e);
      return null;
    }
  },

  async upsertWaterLog(log: WaterLog, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('water_logs').upsert({
        id: log.id,
        user_id: userId,
        date: log.date,
        amount_ml: log.amountMl,
        timestamp: log.timestamp,
      });
    } catch (e) {
      console.warn('Supabase upsertWaterLog error:', e);
    }
  },

  // Weight Entries
  async fetchWeightEntries(userId: string): Promise<WeightEntry[] | null> {
    if (!isSupabaseConfigured()) return null;
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error || !data) return null;

      return data.map((d) => ({
        id: d.id,
        date: d.date,
        weightKg: d.weight_kg,
        note: d.note,
        timestamp: d.timestamp,
      }));
    } catch (e) {
      console.warn('Supabase fetchWeightEntries error:', e);
      return null;
    }
  },

  async upsertWeightEntry(entry: WeightEntry, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('weight_entries').upsert({
        id: entry.id,
        user_id: userId,
        date: entry.date,
        weight_kg: entry.weightKg,
        note: entry.note,
        timestamp: entry.timestamp,
      });
    } catch (e) {
      console.warn('Supabase upsertWeightEntry error:', e);
    }
  },

  async deleteWeightEntry(entryId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('weight_entries').delete().eq('id', entryId);
    } catch (e) {
      console.warn('Supabase deleteWeightEntry error:', e);
    }
  },
};
