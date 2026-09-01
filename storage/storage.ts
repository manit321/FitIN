import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProfile,
  AppSettings,
  Exercise,
  WorkoutRoutine,
  CompletedWorkout,
  FoodItem,
  LoggedFoodItem,
  WaterLog,
  WeightEntry,
  ActiveWorkout,
} from '../types';
import {
  SEED_USER_PROFILE,
  SEED_APP_SETTINGS,
  SEED_EXERCISES,
  SEED_ROUTINES,
  SEED_COMPLETED_WORKOUTS,
  SEED_FOODS,
  SEED_LOGGED_MEALS,
  SEED_WATER_LOGS,
  SEED_WEIGHT_ENTRIES,
} from '../constants/seedData';

const KEYS = {
  PROFILE: '@apexfit_user_profile',
  SETTINGS: '@apexfit_app_settings',
  EXERCISES: '@apexfit_exercises',
  ROUTINES: '@apexfit_routines',
  COMPLETED_WORKOUTS: '@apexfit_completed_workouts',
  FOODS: '@apexfit_foods',
  LOGGED_MEALS: '@apexfit_logged_meals',
  WATER_LOGS: '@apexfit_water_logs',
  WEIGHT_ENTRIES: '@apexfit_weight_entries',
  ACTIVE_WORKOUT: '@apexfit_active_workout',
};

export const StorageService = {
  async loadInitialData() {
    try {
      const [
        profileJson,
        settingsJson,
        exercisesJson,
        routinesJson,
        completedWorkoutsJson,
        foodsJson,
        loggedMealsJson,
        waterLogsJson,
        weightEntriesJson,
        activeWorkoutJson,
      ] = await Promise.all([
        AsyncStorage.getItem(KEYS.PROFILE),
        AsyncStorage.getItem(KEYS.SETTINGS),
        AsyncStorage.getItem(KEYS.EXERCISES),
        AsyncStorage.getItem(KEYS.ROUTINES),
        AsyncStorage.getItem(KEYS.COMPLETED_WORKOUTS),
        AsyncStorage.getItem(KEYS.FOODS),
        AsyncStorage.getItem(KEYS.LOGGED_MEALS),
        AsyncStorage.getItem(KEYS.WATER_LOGS),
        AsyncStorage.getItem(KEYS.WEIGHT_ENTRIES),
        AsyncStorage.getItem(KEYS.ACTIVE_WORKOUT),
      ]);

      const profile: UserProfile = profileJson
        ? JSON.parse(profileJson)
        : SEED_USER_PROFILE;

      const settings: AppSettings = settingsJson
        ? JSON.parse(settingsJson)
        : SEED_APP_SETTINGS;

      const exercises: Exercise[] = exercisesJson
        ? JSON.parse(exercisesJson)
        : SEED_EXERCISES;

      const routines: WorkoutRoutine[] = routinesJson
        ? JSON.parse(routinesJson)
        : SEED_ROUTINES;

      const completedWorkouts: CompletedWorkout[] = completedWorkoutsJson
        ? JSON.parse(completedWorkoutsJson)
        : SEED_COMPLETED_WORKOUTS;

      const foods: FoodItem[] = foodsJson
        ? JSON.parse(foodsJson)
        : SEED_FOODS;

      const loggedMeals: LoggedFoodItem[] = loggedMealsJson
        ? JSON.parse(loggedMealsJson)
        : SEED_LOGGED_MEALS;

      const waterLogs: WaterLog[] = waterLogsJson
        ? JSON.parse(waterLogsJson)
        : SEED_WATER_LOGS;

      const weightEntries: WeightEntry[] = weightEntriesJson
        ? JSON.parse(weightEntriesJson)
        : SEED_WEIGHT_ENTRIES;

      const activeWorkout: ActiveWorkout | null = activeWorkoutJson
        ? JSON.parse(activeWorkoutJson)
        : null;

      // If first launch, persist seeds immediately
      if (!profileJson) {
        await Promise.all([
          AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)),
          AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings)),
          AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises)),
          AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines)),
          AsyncStorage.setItem(KEYS.COMPLETED_WORKOUTS, JSON.stringify(completedWorkouts)),
          AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods)),
          AsyncStorage.setItem(KEYS.LOGGED_MEALS, JSON.stringify(loggedMeals)),
          AsyncStorage.setItem(KEYS.WATER_LOGS, JSON.stringify(waterLogs)),
          AsyncStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(weightEntries)),
        ]);
      }

      return {
        profile,
        settings,
        exercises,
        routines,
        completedWorkouts,
        foods,
        loggedMeals,
        waterLogs,
        weightEntries,
        activeWorkout,
      };
    } catch (error) {
      console.error('StorageService.loadInitialData error:', error);
      return {
        profile: SEED_USER_PROFILE,
        settings: SEED_APP_SETTINGS,
        exercises: SEED_EXERCISES,
        routines: SEED_ROUTINES,
        completedWorkouts: SEED_COMPLETED_WORKOUTS,
        foods: SEED_FOODS,
        loggedMeals: SEED_LOGGED_MEALS,
        waterLogs: SEED_WATER_LOGS,
        weightEntries: SEED_WEIGHT_ENTRIES,
        activeWorkout: null,
      };
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  async saveExercises(exercises: Exercise[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  },

  async saveRoutines(routines: WorkoutRoutine[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  async saveCompletedWorkouts(workouts: CompletedWorkout[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.COMPLETED_WORKOUTS, JSON.stringify(workouts));
  },

  async saveFoods(foods: FoodItem[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
  },

  async saveLoggedMeals(meals: LoggedFoodItem[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.LOGGED_MEALS, JSON.stringify(meals));
  },

  async saveWaterLogs(waterLogs: WaterLog[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.WATER_LOGS, JSON.stringify(waterLogs));
  },

  async saveWeightEntries(weights: WeightEntry[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(weights));
  },

  async saveActiveWorkout(active: ActiveWorkout | null): Promise<void> {
    if (active) {
      await AsyncStorage.setItem(KEYS.ACTIVE_WORKOUT, JSON.stringify(active));
    } else {
      await AsyncStorage.removeItem(KEYS.ACTIVE_WORKOUT);
    }
  },

  async resetToSeedData() {
    await AsyncStorage.multiRemove(Object.values(KEYS));
    return this.loadInitialData();
  },

  async exportAllData(): Promise<string> {
    const data = await this.loadInitialData();
    return JSON.stringify(data, null, 2);
  },
};
