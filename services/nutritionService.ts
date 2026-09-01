import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FoodItem, LoggedFoodItem } from '../types';

export const NutritionService = {
  // Food Database
  async getFoods(userId: string): Promise<FoodItem[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .or(`user_id.eq.${userId},is_custom.eq.false`);

      if (error || !data) return [];
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
    } catch {
      return [];
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
      console.warn('NutritionService.upsertFood error:', e);
    }
  },

  // Logged Meals
  async getLoggedMeals(userId: string): Promise<LoggedFoodItem[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('logged_meals')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error || !data) return [];
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
    } catch {
      return [];
    }
  },

  async upsertLoggedMeal(meal: LoggedFoodItem, userId: string): Promise<void> {
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
      console.warn('NutritionService.upsertLoggedMeal error:', e);
    }
  },

  async deleteLoggedMeal(mealId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('logged_meals').delete().eq('id', mealId);
    } catch (e) {
      console.warn('NutritionService.deleteLoggedMeal error:', e);
    }
  },
};
