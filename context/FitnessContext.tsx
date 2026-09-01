import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import * as Haptics from 'expo-haptics';
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
  WorkoutSet,
  ActiveWorkoutExercise,
  MealCategory,
  PRBrokenEvent,
} from '../types';
import { StorageService } from '../storage/storage';
import { SupabaseService } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
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
import {
  calculate1RM,
  calculateNutritionTargets,
} from '../utils/calculations';

interface RestTimerState {
  isActive: boolean;
  targetSeconds: number;
  remainingSeconds: number;
  exerciseName?: string;
}

interface FitnessContextType {
  isHydrated: boolean;
  profile: UserProfile;
  settings: AppSettings;
  exercises: Exercise[];
  routines: WorkoutRoutine[];
  completedWorkouts: CompletedWorkout[];
  foods: FoodItem[];
  loggedMeals: LoggedFoodItem[];
  waterLogs: WaterLog[];
  weightEntries: WeightEntry[];
  activeWorkout: ActiveWorkout | null;
  restTimer: RestTimerState;
  
  // Profile & Settings
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  
  // Exercise & Routines
  addCustomExercise: (exercise: Omit<Exercise, 'id'>) => Promise<Exercise>;
  addOrUpdateRoutine: (routine: WorkoutRoutine) => Promise<void>;
  deleteRoutine: (routineId: string) => Promise<void>;
  
  // Active Workout Session
  startWorkout: (source: WorkoutRoutine | Exercise[], customName?: string) => void;
  updateActiveSet: (
    exerciseIndex: number,
    setIndex: number,
    updates: Partial<WorkoutSet>
  ) => void;
  toggleSetCompleted: (exerciseIndex: number, setIndex: number) => void;
  addActiveSet: (exerciseIndex: number) => void;
  removeActiveSet: (exerciseIndex: number, setIndex: number) => void;
  addActiveExercise: (exercise: Exercise) => void;
  removeActiveExercise: (exerciseIndex: number) => void;
  finishActiveWorkout: (notes?: string) => Promise<CompletedWorkout | null>;
  cancelActiveWorkout: () => void;
  
  // Rest Timer
  startRestTimer: (seconds: number, exerciseName?: string) => void;
  stopRestTimer: () => void;
  adjustRestTimer: (deltaSeconds: number) => void;
  
  // Nutrition & Water
  addLoggedFood: (
    food: FoodItem,
    meal: MealCategory,
    servings: number,
    dateStr?: string
  ) => Promise<void>;
  deleteLoggedFood: (loggedId: string) => Promise<void>;
  addCustomFood: (food: Omit<FoodItem, 'id'>) => Promise<FoodItem>;
  addWater: (amountMl: number, dateStr?: string) => Promise<void>;
  setWater: (totalMl: number, dateStr?: string) => Promise<void>;
  
  // Weight & History
  logWeight: (weightKg: number, note?: string, dateStr?: string) => Promise<void>;
  deleteWeightEntry: (entryId: string) => Promise<void>;
  deleteCompletedWorkout: (workoutId: string) => Promise<void>;
  resetAllData: () => Promise<void>;
  syncWithCloud: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | null>(null);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(SEED_USER_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(SEED_APP_SETTINGS);
  const [exercises, setExercises] = useState<Exercise[]>(SEED_EXERCISES);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(SEED_ROUTINES);
  const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[]>(
    SEED_COMPLETED_WORKOUTS
  );
  const [foods, setFoods] = useState<FoodItem[]>(SEED_FOODS);
  const [loggedMeals, setLoggedMeals] = useState<LoggedFoodItem[]>(
    SEED_LOGGED_MEALS
  );
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(SEED_WATER_LOGS);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(
    SEED_WEIGHT_ENTRIES
  );
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(null);

  // Rest Timer State
  const [restTimer, setRestTimer] = useState<RestTimerState>({
    isActive: false,
    targetSeconds: 90,
    remainingSeconds: 0,
    exerciseName: undefined,
  });

  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeWorkoutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync from Supabase
  const syncWithCloud = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    try {
      const [
        remoteProfile,
        remoteExercises,
        remoteRoutines,
        remoteWorkouts,
        remoteFoods,
        remoteMeals,
        remoteWater,
        remoteWeights,
      ] = await Promise.all([
        SupabaseService.fetchProfile(profile.id),
        SupabaseService.fetchExercises(),
        SupabaseService.fetchRoutines(profile.id),
        SupabaseService.fetchCompletedWorkouts(profile.id),
        SupabaseService.fetchFoods(profile.id),
        SupabaseService.fetchLoggedMeals(profile.id),
        SupabaseService.fetchWaterLogs(profile.id),
        SupabaseService.fetchWeightEntries(profile.id),
      ]);

      if (remoteProfile) {
        setProfile(remoteProfile);
        StorageService.saveProfile(remoteProfile);
      }
      if (remoteExercises && remoteExercises.length > 0) {
        setExercises(remoteExercises);
        StorageService.saveExercises(remoteExercises);
      }
      if (remoteRoutines && remoteRoutines.length > 0) {
        setRoutines(remoteRoutines);
        StorageService.saveRoutines(remoteRoutines);
      }
      if (remoteWorkouts) {
        setCompletedWorkouts(remoteWorkouts);
        StorageService.saveCompletedWorkouts(remoteWorkouts);
      }
      if (remoteFoods && remoteFoods.length > 0) {
        setFoods(remoteFoods);
        StorageService.saveFoods(remoteFoods);
      }
      if (remoteMeals) {
        setLoggedMeals(remoteMeals);
        StorageService.saveLoggedMeals(remoteMeals);
      }
      if (remoteWater) {
        setWaterLogs(remoteWater);
        StorageService.saveWaterLogs(remoteWater);
      }
      if (remoteWeights) {
        setWeightEntries(remoteWeights);
        StorageService.saveWeightEntries(remoteWeights);
      }
    } catch (err) {
      console.warn('Cloud sync error:', err);
    }
  }, [profile.id]);

  // Load from AsyncStorage on mount and then try cloud sync
  useEffect(() => {
    async function loadData() {
      const data = await StorageService.loadInitialData();
      setProfile(data.profile);
      setSettings(data.settings);
      setExercises(data.exercises);
      setRoutines(data.routines);
      setCompletedWorkouts(data.completedWorkouts);
      setFoods(data.foods);
      setLoggedMeals(data.loggedMeals);
      setWaterLogs(data.waterLogs);
      setWeightEntries(data.weightEntries);
      setActiveWorkout(data.activeWorkout);
      setIsHydrated(true);

      // Background cloud sync
      if (isSupabaseConfigured()) {
        syncWithCloud();
      }
    }
    loadData();
  }, [syncWithCloud]);

  // Active workout live stopwatch
  useEffect(() => {
    if (activeWorkout && !activeWorkout.isPaused) {
      activeWorkoutTimerRef.current = setInterval(() => {
        setActiveWorkout((prev) => {
          if (!prev || prev.isPaused) return prev;
          const updated = {
            ...prev,
            elapsedTimeSeconds: prev.elapsedTimeSeconds + 1,
          };
          StorageService.saveActiveWorkout(updated);
          return updated;
        });
      }, 1000);
    } else {
      if (activeWorkoutTimerRef.current) {
        clearInterval(activeWorkoutTimerRef.current);
        activeWorkoutTimerRef.current = null;
      }
    }

    return () => {
      if (activeWorkoutTimerRef.current) {
        clearInterval(activeWorkoutTimerRef.current);
      }
    };
  }, [activeWorkout?.isPaused, activeWorkout?.id]);

  // Rest timer countdown effect
  useEffect(() => {
    if (restTimer.isActive && restTimer.remainingSeconds > 0) {
      restTimerRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev.remainingSeconds <= 1) {
            if (settings.hapticsEnabled) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            return {
              ...prev,
              isActive: false,
              remainingSeconds: 0,
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    } else if (restTimer.remainingSeconds <= 0 && restTimer.isActive) {
      setRestTimer((prev) => ({ ...prev, isActive: false }));
    }

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
      }
    };
  }, [restTimer.isActive, restTimer.remainingSeconds, settings.hapticsEnabled]);

  // Helper trigger for haptics
  const triggerHaptic = useCallback(
    (type: 'impact' | 'selection' | 'success' | 'warning' = 'impact') => {
      if (!settings.hapticsEnabled) return;
      if (type === 'impact') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (type === 'selection') {
        Haptics.selectionAsync();
      } else if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [settings.hapticsEnabled]
  );

  // Update profile
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      setProfile((prev) => {
        let updated = { ...prev, ...updates };

        if (
          !updated.isManualMacroOverride &&
          (updates.weightKg ||
            updates.heightCm ||
            updates.age ||
            updates.gender ||
            updates.activityLevel ||
            updates.fitnessGoal)
        ) {
          const targets = calculateNutritionTargets(
            updated.gender,
            updated.weightKg,
            updated.heightCm,
            updated.age,
            updated.activityLevel,
            updated.fitnessGoal
          );
          updated = { ...updated, ...targets };
        }

        StorageService.saveProfile(updated);
        SupabaseService.upsertProfile(updated);
        return updated;
      });
      triggerHaptic('success');
    },
    [triggerHaptic]
  );

  // Update settings
  const updateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = { ...prev, ...updates };
        StorageService.saveSettings(updated);
        return updated;
      });
      triggerHaptic('selection');
    },
    [triggerHaptic]
  );

  // Add custom exercise
  const addCustomExercise = useCallback(
    async (newEx: Omit<Exercise, 'id'>) => {
      const exercise: Exercise = {
        ...newEx,
        id: `ex-custom-${Date.now()}`,
        isCustom: true,
      };
      const updated = [exercise, ...exercises];
      setExercises(updated);
      await StorageService.saveExercises(updated);
      SupabaseService.upsertExercise(exercise);
      triggerHaptic('success');
      return exercise;
    },
    [exercises, triggerHaptic]
  );

  // Add or update routine
  const addOrUpdateRoutine = useCallback(
    async (routine: WorkoutRoutine) => {
      setRoutines((prev) => {
        const index = prev.findIndex((r) => r.id === routine.id);
        let updated: WorkoutRoutine[];
        if (index >= 0) {
          updated = [...prev];
          updated[index] = routine;
        } else {
          updated = [routine, ...prev];
        }
        StorageService.saveRoutines(updated);
        SupabaseService.upsertRoutine(routine, profile.id);
        return updated;
      });
      triggerHaptic('success');
    },
    [profile.id, triggerHaptic]
  );

  // Delete routine
  const deleteRoutine = useCallback(
    async (routineId: string) => {
      setRoutines((prev) => {
        const updated = prev.filter((r) => r.id !== routineId);
        StorageService.saveRoutines(updated);
        SupabaseService.deleteRoutine(routineId);
        return updated;
      });
      triggerHaptic('warning');
    },
    [triggerHaptic]
  );

  // Start workout session
  const startWorkout = useCallback(
    (source: WorkoutRoutine | Exercise[], customName?: string) => {
      let activeExercises: ActiveWorkoutExercise[] = [];
      let routineId: string | undefined;
      let routineTitle = customName || 'Custom Workout';

      if ('exercises' in source && Array.isArray((source as WorkoutRoutine).exercises)) {
        const routine = source as WorkoutRoutine;
        routineId = routine.id;
        routineTitle = routine.name;

        activeExercises = routine.exercises.map((re) => {
          const ex = exercises.find((e) => e.id === re.exerciseId) || {
            id: re.exerciseId,
            name: 'Unknown Exercise',
            targetMuscle: 'Full Body' as const,
            secondaryMuscles: [],
            equipment: 'Barbell' as const,
            movementPattern: 'Compound' as const,
            difficulty: 'Intermediate' as const,
            instructions: [],
            tips: [],
          };

          const defaultWeight = re.targetWeightKg || 20;
          const defaultReps = re.targetRepsMin || 10;

          const sets: WorkoutSet[] = Array.from({ length: re.targetSets }).map(
            (_, idx) => ({
              id: `set-${Date.now()}-${idx}`,
              setNumber: idx + 1,
              weightKg: defaultWeight,
              reps: defaultReps,
              isCompleted: false,
              prevWeightKg: defaultWeight,
              prevReps: defaultReps,
            })
          );

          return {
            exercise: ex,
            sets,
            targetRestSeconds: re.restSeconds || settings.defaultRestSeconds,
            notes: re.notes,
          };
        });
      } else {
        const exList = source as Exercise[];
        activeExercises = exList.map((ex) => ({
          exercise: ex,
          sets: [
            {
              id: `set-${Date.now()}-0`,
              setNumber: 1,
              weightKg: 20,
              reps: 10,
              isCompleted: false,
            },
            {
              id: `set-${Date.now()}-1`,
              setNumber: 2,
              weightKg: 20,
              reps: 10,
              isCompleted: false,
            },
            {
              id: `set-${Date.now()}-2`,
              setNumber: 3,
              weightKg: 20,
              reps: 10,
              isCompleted: false,
            },
          ],
          targetRestSeconds: settings.defaultRestSeconds,
        }));
      }

      const newActive: ActiveWorkout = {
        id: `act-${Date.now()}`,
        routineId,
        routineName: routineTitle,
        startTime: new Date().toISOString(),
        elapsedTimeSeconds: 0,
        exercises: activeExercises,
        currentExerciseIndex: 0,
        isPaused: false,
      };

      setActiveWorkout(newActive);
      StorageService.saveActiveWorkout(newActive);
      triggerHaptic('impact');
    },
    [exercises, settings.defaultRestSeconds, triggerHaptic]
  );

  // Update active workout set
  const updateActiveSet = useCallback(
    (exerciseIndex: number, setIndex: number, updates: Partial<WorkoutSet>) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        const ex = copy.exercises[exerciseIndex];
        if (!ex) return prev;

        const updatedSets = [...ex.sets];
        updatedSets[setIndex] = { ...updatedSets[setIndex], ...updates };
        copy.exercises[exerciseIndex] = { ...ex, sets: updatedSets };

        StorageService.saveActiveWorkout(copy);
        return copy;
      });
    },
    []
  );

  // Toggle set completed with automatic rest timer
  const toggleSetCompleted = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        const ex = copy.exercises[exerciseIndex];
        if (!ex) return prev;

        const updatedSets = [...ex.sets];
        const currentSet = updatedSets[setIndex];
        const newStatus = !currentSet.isCompleted;
        updatedSets[setIndex] = { ...currentSet, isCompleted: newStatus };
        copy.exercises[exerciseIndex] = { ...ex, sets: updatedSets };

        StorageService.saveActiveWorkout(copy);

        if (newStatus) {
          triggerHaptic('success');
          if (settings.restTimerAutoStart && ex.targetRestSeconds > 0) {
            setRestTimer({
              isActive: true,
              targetSeconds: ex.targetRestSeconds,
              remainingSeconds: ex.targetRestSeconds,
              exerciseName: ex.exercise.name,
            });
          }
        } else {
          triggerHaptic('selection');
        }

        return copy;
      });
    },
    [settings.restTimerAutoStart, triggerHaptic]
  );

  // Add set to active exercise
  const addActiveSet = useCallback(
    (exerciseIndex: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        const ex = copy.exercises[exerciseIndex];
        if (!ex) return prev;

        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet: WorkoutSet = {
          id: `set-${Date.now()}-${ex.sets.length}`,
          setNumber: ex.sets.length + 1,
          weightKg: lastSet ? lastSet.weightKg : 20,
          reps: lastSet ? lastSet.reps : 10,
          isCompleted: false,
          prevWeightKg: lastSet?.weightKg,
          prevReps: lastSet?.reps,
        };

        copy.exercises[exerciseIndex] = { ...ex, sets: [...ex.sets, newSet] };
        StorageService.saveActiveWorkout(copy);
        triggerHaptic('selection');
        return copy;
      });
    },
    [triggerHaptic]
  );

  // Remove set from active exercise
  const removeActiveSet = useCallback(
    (exerciseIndex: number, setIndex: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const copy = { ...prev };
        const ex = copy.exercises[exerciseIndex];
        if (!ex || ex.sets.length <= 1) return prev;

        const filtered = ex.sets
          .filter((_, idx) => idx !== setIndex)
          .map((s, idx) => ({ ...s, setNumber: idx + 1 }));

        copy.exercises[exerciseIndex] = { ...ex, sets: filtered };
        StorageService.saveActiveWorkout(copy);
        triggerHaptic('selection');
        return copy;
      });
    },
    [triggerHaptic]
  );

  // Add exercise to active session
  const addActiveExercise = useCallback(
    (exercise: Exercise) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const newActiveEx: ActiveWorkoutExercise = {
          exercise,
          sets: [
            { id: `set-${Date.now()}-0`, setNumber: 1, weightKg: 20, reps: 10, isCompleted: false },
            { id: `set-${Date.now()}-1`, setNumber: 2, weightKg: 20, reps: 10, isCompleted: false },
            { id: `set-${Date.now()}-2`, setNumber: 3, weightKg: 20, reps: 10, isCompleted: false },
          ],
          targetRestSeconds: settings.defaultRestSeconds,
        };

        const copy = {
          ...prev,
          exercises: [...prev.exercises, newActiveEx],
        };
        StorageService.saveActiveWorkout(copy);
        triggerHaptic('success');
        return copy;
      });
    },
    [settings.defaultRestSeconds, triggerHaptic]
  );

  // Remove exercise from active session
  const removeActiveExercise = useCallback(
    (exerciseIndex: number) => {
      setActiveWorkout((prev) => {
        if (!prev) return null;
        const filtered = prev.exercises.filter((_, idx) => idx !== exerciseIndex);
        const copy = {
          ...prev,
          exercises: filtered,
          currentExerciseIndex: Math.min(prev.currentExerciseIndex, Math.max(0, filtered.length - 1)),
        };
        StorageService.saveActiveWorkout(copy);
        triggerHaptic('warning');
        return copy;
      });
    },
    [triggerHaptic]
  );

  // Finish active workout
  const finishActiveWorkout = useCallback(
    async (notes?: string): Promise<CompletedWorkout | null> => {
      if (!activeWorkout) return null;

      const endTime = new Date().toISOString();
      const dateStr = endTime.split('T')[0];

      let totalVolume = 0;
      let totalSets = 0;
      let totalReps = 0;
      const completedExercisesSummary: CompletedWorkout['exercises'] = [];
      const prsBroken: PRBrokenEvent[] = [];
      const updatedExercises = [...exercises];

      activeWorkout.exercises.forEach((ae) => {
        const completedSets = ae.sets.filter((s) => s.isCompleted);
        if (completedSets.length > 0) {
          const setsSummary = completedSets.map((s) => {
            totalVolume += s.weightKg * s.reps;
            totalSets += 1;
            totalReps += s.reps;

            const current1RM = calculate1RM(s.weightKg, s.reps);
            const exIndex = updatedExercises.findIndex((e) => e.id === ae.exercise.id);
            if (exIndex >= 0) {
              const existingEx = updatedExercises[exIndex];
              const prev1RM = existingEx.personalRecord?.calculated1RM || 0;
              if (current1RM > prev1RM && s.weightKg > 0) {
                const newPR = {
                  weightKg: s.weightKg,
                  reps: s.reps,
                  calculated1RM: current1RM,
                  date: dateStr,
                };
                updatedExercises[exIndex] = {
                  ...existingEx,
                  personalRecord: newPR,
                };
                prsBroken.push({
                  exerciseId: existingEx.id,
                  exerciseName: existingEx.name,
                  weightKg: s.weightKg,
                  reps: s.reps,
                  previous1RM: prev1RM,
                  new1RM: current1RM,
                });
              }
            }

            return {
              setNumber: s.setNumber,
              weightKg: s.weightKg,
              reps: s.reps,
              isCompleted: true,
            };
          });

          completedExercisesSummary.push({
            exerciseId: ae.exercise.id,
            exerciseName: ae.exercise.name,
            targetMuscle: ae.exercise.targetMuscle,
            sets: setsSummary,
          });
        }
      });

      const minutes = Math.max(1, Math.round(activeWorkout.elapsedTimeSeconds / 60));
      const caloriesBurned = Math.round(minutes * 6.8);

      const completed: CompletedWorkout = {
        id: `cw-${Date.now()}`,
        routineId: activeWorkout.routineId,
        routineName: activeWorkout.routineName,
        startTime: activeWorkout.startTime,
        endTime,
        date: dateStr,
        durationSeconds: activeWorkout.elapsedTimeSeconds,
        totalVolumeKg: totalVolume,
        totalSetsCompleted: totalSets,
        totalRepsCompleted: totalReps,
        caloriesBurned,
        exercises: completedExercisesSummary,
        notes,
        personalRecordsBroken: prsBroken,
      };

      const updatedHistory = [completed, ...completedWorkouts];
      setCompletedWorkouts(updatedHistory);
      await StorageService.saveCompletedWorkouts(updatedHistory);
      SupabaseService.upsertCompletedWorkout(completed, profile.id);

      if (prsBroken.length > 0) {
        setExercises(updatedExercises);
        await StorageService.saveExercises(updatedExercises);
        updatedExercises.forEach((ex) => SupabaseService.upsertExercise(ex));
      }

      if (activeWorkout.routineId) {
        setRoutines((prev) => {
          const rIndex = prev.findIndex((r) => r.id === activeWorkout.routineId);
          if (rIndex >= 0) {
            const updatedRoutines = [...prev];
            const old = updatedRoutines[rIndex];
            updatedRoutines[rIndex] = {
              ...old,
              timesCompleted: (old.timesCompleted || 0) + 1,
              lastPerformedDate: dateStr,
            };
            StorageService.saveRoutines(updatedRoutines);
            SupabaseService.upsertRoutine(updatedRoutines[rIndex], profile.id);
            return updatedRoutines;
          }
          return prev;
        });
      }

      setActiveWorkout(null);
      await StorageService.saveActiveWorkout(null);
      setRestTimer({ isActive: false, targetSeconds: 90, remainingSeconds: 0 });

      triggerHaptic('success');
      return completed;
    },
    [activeWorkout, completedWorkouts, exercises, profile.id, triggerHaptic]
  );

  // Cancel active workout
  const cancelActiveWorkout = useCallback(() => {
    setActiveWorkout(null);
    StorageService.saveActiveWorkout(null);
    setRestTimer({ isActive: false, targetSeconds: 90, remainingSeconds: 0 });
    triggerHaptic('warning');
  }, [triggerHaptic]);

  // Rest Timer Controls
  const startRestTimer = useCallback((seconds: number, exerciseName?: string) => {
    setRestTimer({
      isActive: true,
      targetSeconds: seconds,
      remainingSeconds: seconds,
      exerciseName,
    });
  }, []);

  const stopRestTimer = useCallback(() => {
    setRestTimer((prev) => ({ ...prev, isActive: false, remainingSeconds: 0 }));
  }, []);

  const adjustRestTimer = useCallback((deltaSeconds: number) => {
    setRestTimer((prev) => {
      const nextRemaining = Math.max(0, prev.remainingSeconds + deltaSeconds);
      return {
        ...prev,
        remainingSeconds: nextRemaining,
        isActive: nextRemaining > 0,
      };
    });
  }, []);

  // Add logged food item
  const addLoggedFood = useCallback(
    async (
      food: FoodItem,
      meal: MealCategory,
      servings: number,
      dateStr?: string
    ) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const newLog: LoggedFoodItem = {
        id: `food-log-${Date.now()}`,
        foodId: food.id,
        name: food.name,
        meal,
        date: targetDate,
        servings,
        servingUnit: food.servingSize,
        calories: Math.round(food.calories * servings),
        proteinG: Math.round(food.proteinG * servings * 10) / 10,
        carbsG: Math.round(food.carbsG * servings * 10) / 10,
        fatG: Math.round(food.fatG * servings * 10) / 10,
        fiberG: Math.round((food.fiberG || 0) * servings * 10) / 10,
        timestamp: new Date().toISOString(),
      };

      const updated = [newLog, ...loggedMeals];
      setLoggedMeals(updated);
      await StorageService.saveLoggedMeals(updated);
      SupabaseService.upsertLoggedMeal(newLog, profile.id);
      triggerHaptic('success');
    },
    [loggedMeals, profile.id, triggerHaptic]
  );

  // Delete logged food item
  const deleteLoggedFood = useCallback(
    async (loggedId: string) => {
      const updated = loggedMeals.filter((m) => m.id !== loggedId);
      setLoggedMeals(updated);
      await StorageService.saveLoggedMeals(updated);
      SupabaseService.deleteLoggedMeal(loggedId);
      triggerHaptic('warning');
    },
    [loggedMeals, triggerHaptic]
  );

  // Add custom food to catalog
  const addCustomFood = useCallback(
    async (newFood: Omit<FoodItem, 'id'>) => {
      const item: FoodItem = {
        ...newFood,
        id: `food-custom-${Date.now()}`,
        isCustom: true,
      };
      const updated = [item, ...foods];
      setFoods(updated);
      await StorageService.saveFoods(updated);
      SupabaseService.upsertFood(item, profile.id);
      triggerHaptic('success');
      return item;
    },
    [foods, profile.id, triggerHaptic]
  );

  // Add water
  const addWater = useCallback(
    async (amountMl: number, dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const newWater: WaterLog = {
        id: `w-${Date.now()}`,
        date: targetDate,
        amountMl,
        timestamp: new Date().toISOString(),
      };
      const updated = [newWater, ...waterLogs];
      setWaterLogs(updated);
      await StorageService.saveWaterLogs(updated);
      SupabaseService.upsertWaterLog(newWater, profile.id);
      triggerHaptic('impact');
    },
    [profile.id, waterLogs, triggerHaptic]
  );

  // Set exact total water for a day
  const setWater = useCallback(
    async (totalMl: number, dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const filtered = waterLogs.filter((w) => w.date !== targetDate);
      const newWater: WaterLog = {
        id: `w-${Date.now()}`,
        date: targetDate,
        amountMl: totalMl,
        timestamp: new Date().toISOString(),
      };
      const updated = [newWater, ...filtered];
      setWaterLogs(updated);
      await StorageService.saveWaterLogs(updated);
      SupabaseService.upsertWaterLog(newWater, profile.id);
      triggerHaptic('impact');
    },
    [profile.id, waterLogs, triggerHaptic]
  );

  // Log body weight
  const logWeight = useCallback(
    async (weightKg: number, note?: string, dateStr?: string) => {
      const targetDate = dateStr || new Date().toISOString().split('T')[0];
      const newEntry: WeightEntry = {
        id: `wt-${Date.now()}`,
        date: targetDate,
        weightKg,
        note,
        timestamp: new Date().toISOString(),
      };

      const filtered = weightEntries.filter((w) => w.date !== targetDate);
      const updated = [newEntry, ...filtered].sort((a, b) => (a.date < b.date ? -1 : 1));
      setWeightEntries(updated);
      await StorageService.saveWeightEntries(updated);
      SupabaseService.upsertWeightEntry(newEntry, profile.id);

      setProfile((prev) => {
        const u = { ...prev, weightKg };
        StorageService.saveProfile(u);
        SupabaseService.upsertProfile(u);
        return u;
      });

      triggerHaptic('success');
    },
    [profile.id, weightEntries, triggerHaptic]
  );

  // Delete weight entry
  const deleteWeightEntry = useCallback(
    async (entryId: string) => {
      const updated = weightEntries.filter((w) => w.id !== entryId);
      setWeightEntries(updated);
      await StorageService.saveWeightEntries(updated);
      SupabaseService.deleteWeightEntry(entryId);
      triggerHaptic('warning');
    },
    [weightEntries, triggerHaptic]
  );

  // Delete completed workout
  const deleteCompletedWorkout = useCallback(
    async (workoutId: string) => {
      const updated = completedWorkouts.filter((w) => w.id !== workoutId);
      setCompletedWorkouts(updated);
      await StorageService.saveCompletedWorkouts(updated);
      SupabaseService.deleteCompletedWorkout(workoutId);
      triggerHaptic('warning');
    },
    [completedWorkouts, triggerHaptic]
  );

  // Reset all data back to clean sample seed
  const resetAllData = useCallback(async () => {
    const data = await StorageService.resetToSeedData();
    setProfile(data.profile);
    setSettings(data.settings);
    setExercises(data.exercises);
    setRoutines(data.routines);
    setCompletedWorkouts(data.completedWorkouts);
    setFoods(data.foods);
    setLoggedMeals(data.loggedMeals);
    setWaterLogs(data.waterLogs);
    setWeightEntries(data.weightEntries);
    setActiveWorkout(null);
    triggerHaptic('success');
  }, [triggerHaptic]);

  return (
    <FitnessContext.Provider
      value={{
        isHydrated,
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
        restTimer,
        updateProfile,
        updateSettings,
        addCustomExercise,
        addOrUpdateRoutine,
        deleteRoutine,
        startWorkout,
        updateActiveSet,
        toggleSetCompleted,
        addActiveSet,
        removeActiveSet,
        addActiveExercise,
        removeActiveExercise,
        finishActiveWorkout,
        cancelActiveWorkout,
        startRestTimer,
        stopRestTimer,
        adjustRestTimer,
        addLoggedFood,
        deleteLoggedFood,
        addCustomFood,
        addWater,
        setWater,
        logWeight,
        deleteWeightEntry,
        deleteCompletedWorkout,
        resetAllData,
        syncWithCloud,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export function useFitness() {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}
