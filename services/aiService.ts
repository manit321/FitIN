import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, CompletedWorkout, LoggedFoodItem, WeightEntry } from '../types';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIUserContext {
  name: string;
  goal: string;
  gender: string;
  age: number;
  weightKg: number;
  targetWeightKg: number;
  targetCalories: number;
  targetProteinG: number;
  todayCaloriesConsumed: number;
  todayProteinConsumed: number;
  recentWorkoutsCount: number;
  lastWorkoutName?: string;
  streakDays: number;
}

export const AIService = {
  /**
   * Builds compact context payload for the AI model
   */
  buildUserContext(
    profile: UserProfile,
    todayMeals: LoggedFoodItem[],
    completedWorkouts: CompletedWorkout[],
    streakDays: number
  ): AIUserContext {
    const todayCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
    const todayProtein = todayMeals.reduce((acc, m) => acc + m.proteinG, 0);
    const lastWorkout = completedWorkouts[0];

    return {
      name: profile.name,
      goal: profile.fitnessGoal,
      gender: profile.gender,
      age: profile.age,
      weightKg: profile.weightKg,
      targetWeightKg: profile.targetWeightKg,
      targetCalories: profile.targetCalories,
      targetProteinG: profile.targetProteinG,
      todayCaloriesConsumed: todayCalories,
      todayProteinConsumed: Math.round(todayProtein),
      recentWorkoutsCount: completedWorkouts.length,
      lastWorkoutName: lastWorkout ? lastWorkout.routineName : undefined,
      streakDays,
    };
  },

  /**
   * Generates response from AI Coach (via Supabase Edge Function with intelligent heuristic fallback)
   */
  async sendMessage(
    userMessage: string,
    history: AIMessage[],
    context: AIUserContext
  ): Promise<string> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: {
            message: userMessage,
            history: history.slice(-6), // Send last 6 messages to keep context token-efficient
            context,
          },
        });

        if (!error && data?.reply) {
          return data.reply;
        }
      } catch (err) {
        console.warn('Edge function invoke fallback:', err);
      }
    }

    // Intelligent local fitness heuristic engine if edge function is offline
    return this.generateHeuristicResponse(userMessage, context);
  },

  /**
   * Local intelligent heuristic response engine
   */
  generateHeuristicResponse(message: string, ctx: AIUserContext): string {
    const lower = message.toLowerCase();

    if (lower.includes('macro') || lower.includes('calorie') || lower.includes('food') || lower.includes('eat')) {
      const remainingCals = ctx.targetCalories - ctx.todayCaloriesConsumed;
      const remainingProtein = Math.max(0, ctx.targetProteinG - ctx.todayProteinConsumed);

      return `Based on your goal of **${ctx.goal.replace('_', ' ').toUpperCase()}**:\n\n` +
        `• **Target Calories**: ${ctx.targetCalories} kcal (You've consumed ${ctx.todayCaloriesConsumed} kcal, with **${remainingCals >= 0 ? remainingCals : 0} kcal remaining** today).\n` +
        `• **Protein Target**: ${ctx.targetProteinG}g (You have **${remainingProtein}g of protein** left to hit optimal muscle protein synthesis).\n\n` +
        `💡 *Recommendation*: Prioritize lean proteins like chicken breast, eggs, Greek yogurt, or whey isolate for your next meal.`;
    }

    if (lower.includes('workout') || lower.includes('routine') || lower.includes('train') || lower.includes('exercise')) {
      return `For your goal of **${ctx.goal.replace('_', ' ').toUpperCase()}**, here is my progressive overload advice:\n\n` +
        `1. **Focus on Compound Lifts**: Bench Press, Barbell Squats, Romanian Deadlifts, and Overhead Press form the core of strength adaptation.\n` +
        `2. **Target Rep Ranges**: 6–10 reps for strength & hypertrophy, keeping 1–2 reps in reserve (RIR 1-2).\n` +
        `3. **Rest Intervals**: Rest 2 to 3 minutes between heavy compound sets to restore ATP levels.\n\n` +
        `You have completed **${ctx.recentWorkoutsCount} sessions** so far. Keep the momentum going!`;
    }

    if (lower.includes('plateau') || lower.includes('stuck') || lower.includes('weight')) {
      const delta = Math.round((ctx.weightKg - ctx.targetWeightKg) * 10) / 10;
      return `Here is how we break your plateau:\n\n` +
        `• Current Weight: **${ctx.weightKg} kg** (Target: **${ctx.targetWeightKg} kg**, ${delta > 0 ? `${delta} kg to go` : 'Goal met'}).\n\n` +
        `1. **Check Hydration & Sodium**: Daily water fluctuations can mask fat loss. Aim for ${ctx.gender === 'male' ? '3.5L' : '2.8L'} daily.\n` +
        `2. **Deload Week**: If lifting weights feel heavy for 2 weeks in a row, reduce training volume by 40% for 5 days to clear central nervous system fatigue.\n` +
        `3. **Step Count**: Keep daily non-exercise physical activity (NEAT) consistent at 8,000–10,000 steps.`;
    }

    return `Hey ${ctx.name}! 👋 I'm your **APEX AI Fitness Coach**.\n\n` +
      `You're on a **${ctx.streakDays}-day streak** with a target of **${ctx.targetCalories} kcal** and **${ctx.targetProteinG}g protein** daily.\n\n` +
      `How can I assist your training or nutrition today? You can ask me to review today's macros, suggest workout adjustments, or troubleshoot recovery.`;
  },
};
