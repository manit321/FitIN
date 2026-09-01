-- =========================================================
-- APEXFIT - Complete Supabase Database Schema & Seed Data
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. USER PROFILES
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 2. EXERCISES DATABASE
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 3. WORKOUT ROUTINES
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 4. COMPLETED WORKOUTS HISTORY
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 5. FOODS CATALOG
-- ---------------------------------------------------------
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

-- ---------------------------------------------------------
-- 6. LOGGED MEALS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.logged_meals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  food_id TEXT,
  name TEXT NOT NULL,
  meal TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snacks'
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

-- ---------------------------------------------------------
-- 7. WATER LOGS
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.water_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  amount_ml INTEGER NOT NULL DEFAULT 250,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------
-- 8. BODY WEIGHT ENTRIES
-- ---------------------------------------------------------
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allow public access via anon key for seamless client storage
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

-- ---------------------------------------------------------
-- SEED DATA: EXERCISES (30+ Exercises)
-- ---------------------------------------------------------
INSERT INTO public.exercises (id, name, target_muscle, secondary_muscles, equipment, movement_pattern, difficulty, instructions, tips, is_custom, personal_record)
VALUES
('ex-barbell-bench-press', 'Barbell Bench Press', 'Chest', '["Triceps", "Shoulders"]'::jsonb, 'Barbell', 'Push', 'Intermediate', 
 '["Lie flat on the bench with eyes directly beneath the racked barbell.", "Grip the bar slightly wider than shoulder-width with wrists straight.", "Unrack, take a deep breath, and lower the bar under control to mid-chest.", "Drive feet into the floor and press the bar explosively back to lockout."]'::jsonb,
 '["Keep shoulder blades retracted and depressed throughout the movement.", "Tuck elbows at a 45-degree angle rather than flaring them out wide."]'::jsonb, FALSE, '{"weightKg": 100, "reps": 5, "calculated1RM": 116, "date": "2026-08-20"}'::jsonb),

('ex-incline-dumbbell-press', 'Incline Dumbbell Press', 'Chest', '["Shoulders", "Triceps"]'::jsonb, 'Dumbbell', 'Push', 'Intermediate',
 '["Set bench to a 30-degree incline.", "Kick dumbbells up to shoulder level and sit back.", "Press dumbbells upward until arms are extended, bringing them slightly together at the top.", "Lower weights under control until you feel a deep stretch in the upper chest."]'::jsonb,
 '["Avoid setting incline higher than 45 degrees to prevent excessive front delt takeover.", "Control the 3-second eccentric phase for maximum hypertrophy."]'::jsonb, FALSE, '{"weightKg": 34, "reps": 8, "calculated1RM": 43, "date": "2026-08-24"}'::jsonb),

('ex-conventional-deadlift', 'Barbell Conventional Deadlift', 'Back', '["Glutes", "Hamstrings", "Core"]'::jsonb, 'Barbell', 'Hinge', 'Advanced',
 '["Stand with mid-foot under the barbell, feet hip-width apart.", "Hinge hips back and grip bar outside legs.", "Pull slack out of the bar, engage lats, keep chest proud.", "Drive through the floor with your legs and extend hips to stand tall."]'::jsonb,
 '["Never round your lower spine; brace core like you are about to take a punch."]'::jsonb, FALSE, '{"weightKg": 150, "reps": 4, "calculated1RM": 170, "date": "2026-08-22"}'::jsonb),

('ex-lat-pulldown', 'Wide-Grip Lat Pulldown', 'Back', '["Biceps", "Shoulders"]'::jsonb, 'Cable', 'Pull', 'Beginner',
 '["Sit facing the machine with thighs firmly secured under the pads.", "Grip the bar slightly wider than shoulder-width with overhand grip.", "Pull bar down smoothly towards upper clavicle while depressing scapulae.", "Slowly resist weight back up to full overhead stretch."]'::jsonb,
 '["Drive down with your elbows rather than pulling with your forearm flexors."]'::jsonb, FALSE, '{"weightKg": 75, "reps": 10, "calculated1RM": 100, "date": "2026-08-26"}'::jsonb),

('ex-barbell-back-squat', 'Barbell Back Squat', 'Legs', '["Quads", "Glutes", "Core"]'::jsonb, 'Barbell', 'Squat', 'Intermediate',
 '["Rest barbell securely across upper traps with hands gripping firmly.", "Step back, feet shoulder-width, toes angled slightly out.", "Inhale deep, brace core, and sit hips down between knees until hip crease is below knee level.", "Drive powerfully through mid-foot to stand back up."]'::jsonb,
 '["Keep knees tracking in line with your toes throughout the descent and ascent."]'::jsonb, FALSE, '{"weightKg": 130, "reps": 5, "calculated1RM": 151, "date": "2026-08-21"}'::jsonb),

('ex-overhead-press', 'Overhead Barbell Military Press', 'Shoulders', '["Triceps", "Core"]'::jsonb, 'Barbell', 'Push', 'Intermediate',
 '["Stand with feet shoulder-width, bar resting across front delts and collarbone.", "Squeeze glutes and brace core.", "Press barbell straight up, moving head slightly back until bar clears, then lock out overhead.", "Lower smoothly back to clavicle."]'::jsonb,
 '["Keep glutes clenched hard to prevent hyperextending your lumbar spine."]'::jsonb, FALSE, '{"weightKg": 65, "reps": 5, "calculated1RM": 75, "date": "2026-08-20"}'::jsonb),

('ex-barbell-bicep-curl', 'EZ-Bar Bicep Curl', 'Biceps', '["Forearms"]'::jsonb, 'Barbell', 'Pull', 'Beginner',
 '["Grip the inner curves of the EZ-bar with palms facing forward.", "Keep elbows pinned to your ribs and curl bar up towards collarbone.", "Squeeze biceps hard at top, then lower smoothly over 3 seconds."]'::jsonb,
 '["Keep upper arms vertical without swinging shoulders forward."]'::jsonb, FALSE, '{"weightKg": 38, "reps": 8, "calculated1RM": 48, "date": "2026-08-26"}'::jsonb),

('ex-cable-tricep-pushdown', 'Cable Tricep Rope Pushdown', 'Triceps', '[]'::jsonb, 'Cable', 'Push', 'Beginner',
 '["Attach rope to high pulley, stand close, elbows tucked at sides.", "Push rope downward until elbows are fully locked, spreading rope ends apart at bottom.", "Control return to chest level."]'::jsonb,
 '["Flare the rope ends outward at full extension for peak lateral head tension."]'::jsonb, FALSE, '{"weightKg": 30, "reps": 12, "calculated1RM": 42, "date": "2026-08-24"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------
-- SEED DATA: POPULAR FOODS
-- ---------------------------------------------------------
INSERT INTO public.foods (id, name, brand, category, serving_size, serving_unit, base_serving_qty, calories, protein_g, carbs_g, fat_g, fiber_g, is_vegetarian, is_vegan, is_indian_regional, is_custom)
VALUES
('food-chicken-breast', 'Grilled Chicken Breast', 'Fresh Butcher Cut', 'Proteins', '100g cooked', 'g', 100, 165, 31, 0, 3.6, 0, FALSE, FALSE, FALSE, FALSE),
('food-whey-isolate', '100% Whey Protein Isolate', 'Gold Standard / Optimum', 'Supplements', '1 scoop (32g)', 'scoop', 1, 120, 25, 2, 1, 0, TRUE, FALSE, FALSE, FALSE),
('food-eggs-whole', 'Large Whole Eggs (Boiled/Fried)', NULL, 'Proteins', '2 large eggs (100g)', 'eggs', 2, 144, 12.6, 0.8, 9.8, 0, TRUE, FALSE, FALSE, FALSE),
('food-paneer-raw', 'Fresh Malai Paneer', NULL, 'Dairy', '100g', 'g', 100, 265, 18, 4, 20, 0, TRUE, FALSE, TRUE, FALSE),
('food-rolled-oats', 'Rolled Oats (Dry)', 'Quaker', 'Carbs', '50g (1/2 cup)', 'g', 50, 190, 6.5, 34, 3, 5, TRUE, TRUE, FALSE, FALSE),
('food-white-rice', 'Cooked Basmati / Jasmine White Rice', NULL, 'Carbs', '150g (1 cup)', 'g', 150, 195, 4.2, 43, 0.5, 0.8, TRUE, TRUE, FALSE, FALSE),
('food-peanut-butter', 'Natural All-Natural Peanut Butter', NULL, 'Fats', '2 tbsp (32g)', 'tbsp', 2, 190, 8, 7, 16, 2.5, TRUE, TRUE, FALSE, FALSE),
('food-greek-yogurt', 'Non-Fat Greek Yogurt', 'Chobani / Fage', 'Dairy', '170g (3/4 cup)', 'g', 170, 100, 18, 6, 0, 0, TRUE, FALSE, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;
