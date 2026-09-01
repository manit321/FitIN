export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'maintain'
  | 'increase_strength'
  | 'improve_fitness'
  | 'increase_frequency';

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'very_active'
  | 'extra_active';

export type Gender = 'male' | 'female' | 'other';

export type MuscleGroup =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Traps'
  | 'Forearms'
  | 'Legs'
  | 'Quads'
  | 'Hamstrings'
  | 'Calves'
  | 'Glutes'
  | 'Core'
  | 'Abs'
  | 'Cardio'
  | 'Full Body';

export type MovementPattern =
  | 'Push'
  | 'Pull'
  | 'Legs'
  | 'Hinge'
  | 'Squat'
  | 'Lunge'
  | 'Carry'
  | 'Cardio'
  | 'Isolation'
  | 'Compound';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Equipment =
  | 'Barbell'
  | 'Dumbbell'
  | 'Cable'
  | 'Machine'
  | 'Bodyweight'
  | 'Smith Machine'
  | 'Kettlebell'
  | 'Resistance Band'
  | 'Cardio Equipment'
  | 'Other';

export interface PersonalRecord {
  weightKg: number;
  reps: number;
  calculated1RM: number;
  date: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  movementPattern: MovementPattern;
  difficulty: Difficulty;
  instructions: string[];
  tips: string[];
  isCustom?: boolean;
  personalRecord?: PersonalRecord;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  isCompleted: boolean;
  rpe?: number;
  prevWeightKg?: number;
  prevReps?: number;
}

export interface RoutineExercise {
  exerciseId: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetWeightKg?: number;
  restSeconds: number;
  notes?: string;
}

export type RoutineCategory =
  | 'Push'
  | 'Pull'
  | 'Legs'
  | 'Full Body'
  | 'Upper'
  | 'Lower'
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Arms'
  | 'Core'
  | 'Cardio'
  | 'Custom';

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  category: RoutineCategory;
  exercises: RoutineExercise[];
  estimatedMinutes: number;
  difficulty: Difficulty;
  tags: string[];
  isCustom?: boolean;
  lastPerformedDate?: string;
  timesCompleted?: number;
}

export interface ActiveWorkoutExercise {
  exercise: Exercise;
  sets: WorkoutSet[];
  targetRestSeconds: number;
  notes?: string;
}

export interface ActiveWorkout {
  id: string;
  routineId?: string;
  routineName: string;
  startTime: string;
  elapsedTimeSeconds: number;
  exercises: ActiveWorkoutExercise[];
  currentExerciseIndex: number;
  isPaused: boolean;
}

export interface CompletedWorkoutSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  isCompleted: boolean;
}

export interface CompletedWorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: MuscleGroup;
  sets: CompletedWorkoutSet[];
}

export interface PRBrokenEvent {
  exerciseId: string;
  exerciseName: string;
  weightKg: number;
  reps: number;
  previous1RM: number;
  new1RM: number;
}

export interface CompletedWorkout {
  id: string;
  routineId?: string;
  routineName: string;
  startTime: string;
  endTime: string;
  date: string; // YYYY-MM-DD
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  totalRepsCompleted: number;
  caloriesBurned: number;
  exercises: CompletedWorkoutExercise[];
  notes?: string;
  personalRecordsBroken: PRBrokenEvent[];
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  category: string;
  servingSize: string;
  servingUnit: string;
  baseServingQty: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isIndianRegional?: boolean;
  isCustom?: boolean;
}

export interface LoggedFoodItem {
  id: string;
  foodId: string;
  name: string;
  meal: MealCategory;
  date: string; // YYYY-MM-DD
  servings: number;
  servingUnit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  timestamp: string;
}

export interface WaterLog {
  id: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  timestamp: string;
}

export interface WeightEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  startWeightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  fitnessGoal: FitnessGoal;
  trainingDaysGoal: number;
  bmr: number;
  tdee: number;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetFiberG: number;
  targetWaterMl: number;
  isManualMacroOverride: boolean;
  isOnboarded: boolean;
  createdAt: string;
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  weightUnit: 'kg' | 'lbs';
  waterUnit: 'ml' | 'oz';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  restTimerAutoStart: boolean;
  defaultRestSeconds: number;
}

export type TimeFilter = '7D' | '30D' | '3M' | '6M' | '1Y';
