-- =========================================================
-- APEXFIT (FitIN) - Versioned Initial Migration
-- Migration: 20260901_initial_schema.sql
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT 'male',
  age INTEGER NOT NULL DEFAULT 26,
  height_cm NUMERIC NOT NULL DEFAULT 178,
  weight_kg NUMERIC NOT NULL DEFAULT 78.4,
  start_weight_kg NUMERIC NOT NULL DEFAULT 82.0,
  target_weight_kg NUMERIC NOT NULL DEFAULT 75.0,
  activity_level TEXT NOT NULL DEFAULT 'very_active',
  fitness_goal TEXT NOT NULL DEFAULT 'build_muscle',
  training_days_goal INTEGER NOT NULL DEFAULT 5,
  bmr INTEGER NOT NULL DEFAULT 1750,
  tdee INTEGER NOT NULL DEFAULT 2650,
  target_calories INTEGER NOT NULL DEFAULT 2400,
  target_protein_g INTEGER NOT NULL DEFAULT 165,
  target_carbs_g INTEGER NOT NULL DEFAULT 260,
  target_fat_g INTEGER NOT NULL DEFAULT 65,
  target_fiber_g INTEGER NOT NULL DEFAULT 32,
  target_water_ml INTEGER NOT NULL DEFAULT 3200,
  is_manual_macro_override BOOLEAN NOT NULL DEFAULT FALSE,
  is_onboarded BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. EXERCISES DATABASE
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  target_muscle TEXT NOT NULL,
  secondary_muscles JSONB NOT NULL DEFAULT '[]'::jsonb,
  equipment TEXT NOT NULL,
  movement_pattern TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  personal_record JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. WORKOUT ROUTINES
CREATE TABLE IF NOT EXISTS public.routines (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'Intermediate',
  estimated_minutes INTEGER NOT NULL DEFAULT 50,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_custom BOOLEAN NOT NULL DEFAULT FALSE,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_performed_date DATE,
  times_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. COMPLETED WORKOUTS HISTORY
CREATE TABLE IF NOT EXISTS public.completed_workouts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  routine_id TEXT,
  routine_name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  date DATE NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  total_volume_kg NUMERIC NOT NULL DEFAULT 0,
  total_sets_completed INTEGER NOT NULL DEFAULT 0,
  total_reps_completed INTEGER NOT NULL DEFAULT 0,
  calories_burned INTEGER NOT NULL DEFAULT 0,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  personal_records_broken JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. FOODS CATALOG
CREATE TABLE IF NOT EXISTS public.foods (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT NOT NULL,
  serving_size TEXT NOT NULL,
  serving_unit TEXT NOT NULL,
  base_serving_qty NUMERIC NOT NULL DEFAULT 1,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC DEFAULT 0,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_indian_regional BOOLEAN DEFAULT FALSE,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LOGGED MEALS
CREATE TABLE IF NOT EXISTS public.logged_meals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  food_id TEXT,
  name TEXT NOT NULL,
  meal TEXT NOT NULL,
  date DATE NOT NULL,
  servings NUMERIC NOT NULL DEFAULT 1,
  serving_unit TEXT NOT NULL,
  calories INTEGER NOT NULL DEFAULT 0,
  protein_g NUMERIC NOT NULL DEFAULT 0,
  carbs_g NUMERIC NOT NULL DEFAULT 0,
  fat_g NUMERIC NOT NULL DEFAULT 0,
  fiber_g NUMERIC DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. WATER LOGS
CREATE TABLE IF NOT EXISTS public.water_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. BODY WEIGHT ENTRIES
CREATE TABLE IF NOT EXISTS public.weight_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  weight_kg NUMERIC NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_completed_workouts_user_date ON public.completed_workouts(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_logged_meals_user_date ON public.logged_meals(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON public.water_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_weight_entries_user_date ON public.weight_entries(user_id, date DESC);

-- ---------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logged_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write exercises" ON public.exercises FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write routines" ON public.routines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write completed_workouts" ON public.completed_workouts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write foods" ON public.foods FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write logged_meals" ON public.logged_meals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write water_logs" ON public.water_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write weight_entries" ON public.weight_entries FOR ALL USING (true) WITH CHECK (true);
