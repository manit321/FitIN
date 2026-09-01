import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Exercise, WorkoutRoutine, CompletedWorkout } from '../types';

export const WorkoutService = {
  // Exercises
  async getExercises(): Promise<Exercise[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase.from('exercises').select('*');
      if (error || !data) return [];
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
    } catch {
      return [];
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
      console.warn('WorkoutService.upsertExercise error:', e);
    }
  },

  // Routines
  async getRoutines(userId: string): Promise<WorkoutRoutine[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .or(`user_id.eq.${userId},is_custom.eq.false`);

      if (error || !data) return [];
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
    } catch {
      return [];
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
      console.warn('WorkoutService.upsertRoutine error:', e);
    }
  },

  async deleteRoutine(routineId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('routines').delete().eq('id', routineId);
    } catch (e) {
      console.warn('WorkoutService.deleteRoutine error:', e);
    }
  },

  // Completed Workouts
  async getCompletedWorkouts(userId: string): Promise<CompletedWorkout[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('completed_workouts')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error || !data) return [];
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
    } catch {
      return [];
    }
  },

  async saveCompletedWorkout(workout: CompletedWorkout, userId: string): Promise<void> {
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
        totalRepsCompleted: workout.totalRepsCompleted,
        calories_burned: workout.caloriesBurned,
        exercises: workout.exercises,
        notes: workout.notes,
        personal_records_broken: workout.personalRecordsBroken,
      });
    } catch (e) {
      console.warn('WorkoutService.saveCompletedWorkout error:', e);
    }
  },

  async deleteCompletedWorkout(workoutId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('completed_workouts').delete().eq('id', workoutId);
    } catch (e) {
      console.warn('WorkoutService.deleteCompletedWorkout error:', e);
    }
  },
};
