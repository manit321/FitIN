import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

export const ProfileService = {
  async getProfile(userId: string): Promise<UserProfile | null> {
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
      console.warn('ProfileService.getProfile error:', e);
      return null;
    }
  },

  async upsertProfile(profile: UserProfile): Promise<{ error: Error | null }> {
    if (!isSupabaseConfigured()) return { error: null };
    try {
      const { error } = await supabase.from('profiles').upsert({
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

      return { error };
    } catch (e: any) {
      return { error: e };
    }
  },
};
