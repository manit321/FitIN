import { Platform } from 'react-native';
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

// Safe wrapper for SSR / Web environments
const memoryCache: Record<string, string> = {};

const SafeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web' && typeof window === 'undefined') {
        return memoryCache[key] ?? null;
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return memoryCache[key] ?? null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window === 'undefined') {
        memoryCache[key] = value;
        return;
      }
      await AsyncStorage.setItem(key, value);
    } catch {
      memoryCache[key] = value;
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window === 'undefined') {
        delete memoryCache[key];
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch {
      delete memoryCache[key];
    }
  },
  async multiRemove(keys: string[]): Promise<void> {
    try {
      if (Platform.OS === 'web' && typeof window === 'undefined') {
        keys.forEach((k) => delete memoryCache[k]);
        return;
      }
      await AsyncStorage.multiRemove(keys);
    } catch {
      keys.forEach((k) => delete memoryCache[k]);
    }
  },
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
        SafeStorage.getItem(KEYS.PROFILE),
        SafeStorage.getItem(KEYS.SETTINGS),
        SafeStorage.getItem(KEYS.EXERCISES),
        SafeStorage.getItem(KEYS.ROUTINES),
        SafeStorage.getItem(KEYS.COMPLETED_WORKOUTS),
        SafeStorage.getItem(KEYS.FOODS),
        SafeStorage.getItem(KEYS.LOGGED_MEALS),
        SafeStorage.getItem(KEYS.WATER_LOGS),
        SafeStorage.getItem(KEYS.WEIGHT_ENTRIES),
        SafeStorage.getItem(KEYS.ACTIVE_WORKOUT),
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
          SafeStorage.setItem(KEYS.PROFILE, JSON.stringify(profile)),
          SafeStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings)),
          SafeStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises)),
          SafeStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines)),
          SafeStorage.setItem(KEYS.COMPLETED_WORKOUTS, JSON.stringify(completedWorkouts)),
          SafeStorage.setItem(KEYS.FOODS, JSON.stringify(foods)),
          SafeStorage.setItem(KEYS.LOGGED_MEALS, JSON.stringify(loggedMeals)),
          SafeStorage.setItem(KEYS.WATER_LOGS, JSON.stringify(waterLogs)),
          SafeStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(weightEntries)),
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
    await SafeStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    await SafeStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  async saveExercises(exercises: Exercise[]): Promise<void> {
    await SafeStorage.setItem(KEYS.EXERCISES, JSON.stringify(exercises));
  },

  async saveRoutines(routines: WorkoutRoutine[]): Promise<void> {
    await SafeStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
  },

  async saveCompletedWorkouts(workouts: CompletedWorkout[]): Promise<void> {
    await SafeStorage.setItem(KEYS.COMPLETED_WORKOUTS, JSON.stringify(workouts));
  },

  async saveFoods(foods: FoodItem[]): Promise<void> {
    await SafeStorage.setItem(KEYS.FOODS, JSON.stringify(foods));
  },

  async saveLoggedMeals(meals: LoggedFoodItem[]): Promise<void> {
    await SafeStorage.setItem(KEYS.LOGGED_MEALS, JSON.stringify(meals));
  },

  async saveWaterLogs(waterLogs: WaterLog[]): Promise<void> {
    await SafeStorage.setItem(KEYS.WATER_LOGS, JSON.stringify(waterLogs));
  },

  async saveWeightEntries(weights: WeightEntry[]): Promise<void> {
    await SafeStorage.setItem(KEYS.WEIGHT_ENTRIES, JSON.stringify(weights));
  },

  async saveActiveWorkout(active: ActiveWorkout | null): Promise<void> {
    if (active) {
      await SafeStorage.setItem(KEYS.ACTIVE_WORKOUT, JSON.stringify(active));
    } else {
      await SafeStorage.removeItem(KEYS.ACTIVE_WORKOUT);
    }
  },

  async resetToSeedData() {
    await SafeStorage.multiRemove(Object.values(KEYS));
    return this.loadInitialData();
  },

  async exportAllData(): Promise<string> {
    const data = await this.loadInitialData();
    return JSON.stringify(data, null, 2);
  },
};
