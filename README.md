# APEXFIT — Unified Workout & Nutrition Tracker 🚀

APEXFIT is a native iOS & Android fitness application built with **React Native**, **Expo SDK 57**, **Expo Router**, **TypeScript**, and **Supabase**.

Inspired by Apple Health, Whoop, and modern athletic interfaces, APEXFIT combines progressive overload workout logging, Mifflin-St Jeor metabolic tracking, global food searching, and an interactive AI fitness coach into a single cohesive experience.

---

## 📱 Tech Stack & Architecture

- **Framework**: Expo SDK 57 (`expo@~57.0.18`, `react-native@0.86.3`)
- **Routing**: Expo Router `~57.0.17` (File-system routing with protected layout guards)
- **Backend & Auth**: Supabase Auth + PostgreSQL with Row Level Security (RLS)
- **State Management**: Reactive Context (`AuthContext`, `FitnessContext`) + Local Cache (`AsyncStorage`)
- **Typography & Theme**: iOS San Francisco scale + Obsidian & Electric Jade design tokens
- **Charts**: Custom SVG Bezier Curves & Concentric Macro Rings (`react-native-svg`)
- **Haptics**: Native iOS tactile feedback (`expo-haptics`)

---

## 🌟 Key Features (10 Phases)

1. **Foundation Architecture**: Standardized tokens (`colors`, `spacing`, `typography`, `theme`), accessible UI component library, and modular service layer.
2. **Supabase Authentication**: Native session persistence, Email/Password sign up, login, password recovery, and route guards.
3. **Interactive Onboarding**: 6-step intake calculating Mifflin-St Jeor BMR, TDEE, Calorie deficit/surplus, and macro splits.
4. **3-Second Home Dashboard**: Concentric macro rings, 1-tap quick actions (+ Workout, + Log Food, + 250ml Water, + Weight), today's workout spotlight, and 7-day consistency bar chart.
5. **Workout System**: Routine explorer (Push/Pull/Legs, Upper/Lower), live active workout tracker, countdown rest timer, 1RM calculator, and celebration summary.
6. **Nutrition System**: Daily energy budget, macronutrient progress (Protein, Carbs, Fat, Fiber), itemized meals, and daily hydration tracker.
7. **Progress Analytics**: Time filters (`7D`, `30D`, `3M`, `6M`, `1Y`), smooth SVG weight and volume progression curves, 28-day consistency matrix, and PR showcase.
8. **AI Fitness Coach**: Context-aware AI coach analyzing today's macros, training volume, and plateau breakthroughs.
9. **Global Food Database & Barcode Search**: Open Food Facts worldwide product database (3+ million items) with barcode lookup and custom food creator.
10. **iOS Hardening & Accessibility**: WCAG AA color contrast, Dynamic Island & safe area handling, keyboard avoidance, and VoiceOver accessibility labels.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- Expo Go on iPhone (App Store version compatible with SDK 54)

### 2. Installation
```bash
git clone https://github.com/manit321/FitIN.git
cd FitIN
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=https://kyzgrkvoppmgwvzxmpwc.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Running the Application
```bash
npx expo start
```
Scan the displayed QR code with your iPhone camera to open in **Expo Go**.

---

## 🗄️ Database Setup (Supabase)

Copy and execute [`supabase/migrations/20260901_initial_schema.sql`](supabase/migrations/20260901_initial_schema.sql) in your **Supabase SQL Editor** to create all tables, indexes, and Row Level Security policies.

---

## 🔒 Security Standards

- Zero private API keys bundled in the mobile application.
- Public client configuration strictly restricted to `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- Row Level Security (RLS) enforced across all database tables.

---

## 🧪 Testing & Verification

- **TypeScript Compilation**: `npx tsc --noEmit` (0 errors)
- **Expo SDK 57 Compliance**: `npx expo-doctor` (21/21 checks passed)
