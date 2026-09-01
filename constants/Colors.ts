/**
 * APEXFIT Design System - White & Light Blue Signature Palette
 * 
 * Clean, minimal, athletic aesthetic inspired by modern fitness trackers.
 * Dominant: Crisp Snow White, Frosted Pearl, and Electric Sky Blue.
 */

export const Palette = {
  // Brand / Signature Accents (Electric Sky Blue & Cyan)
  primary: '#0284C7',          // Electric Sky Blue (Primary Action)
  primaryDark: '#0369A1',      // Deep Ocean Blue
  primaryLight: '#38BDF8',     // Luminous Cyan Blue
  primaryMuted: 'rgba(2, 132, 199, 0.08)',
  primaryGlow: 'rgba(2, 132, 199, 0.18)',
  
  cyan: '#0EA5E9',             // Bright Cyan
  cyanMuted: 'rgba(14, 165, 233, 0.10)',
  
  blue: '#2563EB',             // Royal Athletic Blue
  blueMuted: 'rgba(37, 99, 235, 0.08)',
  
  orange: '#F97316',           // Energy Amber-Orange (Calories / Burn)
  orangeMuted: 'rgba(249, 115, 22, 0.10)',
  
  amber: '#D97706',            // Gold PRs & Trophies
  amberMuted: 'rgba(217, 119, 6, 0.10)',
  
  purple: '#7C3AED',           // Violet Accent
  purpleMuted: 'rgba(124, 58, 237, 0.08)',
  
  rose: '#E11D48',             // Heart Rate / Intensity
  roseMuted: 'rgba(225, 29, 72, 0.08)',

  // Clean White Backgrounds & Surfaces
  bgApp: '#F8FAFC',            // Crisp Snow App Canvas
  bgCard: '#FFFFFF',           // Pure White Surface Level 1
  bgCardElevated: '#F0F9FF',   // Subtle Sky Frosted Surface Level 2
  bgCardHover: '#E0F2FE',      // Light Blue Hover
  bgInput: '#F1F5F9',          // Input Background
  bgModal: '#FFFFFF',          // Modal Background
  
  // Clean Hairline Borders
  borderSubtle: '#E2E8F0',     // Subtle Hairline Divider
  borderDefault: '#CBD5E1',    // Standard Card Border
  borderHighlight: 'rgba(2, 132, 199, 0.35)', // Active / Focused Border
  borderActive: '#0284C7',     // Selected State Border
  
  // Typography Hierarchy (High Contrast on White)
  textPrimary: '#0F172A',      // Deep Obsidian Slate (Headers & Key Numbers)
  textSecondary: '#475569',    // Slate Gray (Labels & Subtitles)
  textMuted: '#64748B',        // Muted Gray (Secondary Hints)
  textDisabled: '#94A3B8',     // Disabled Text
  textInverse: '#FFFFFF',      // White Text on Colored Buttons
  
  // Status Colors
  success: '#10B981',          // Emerald Success
  warning: '#F59E0B',          // Warning Amber
  danger: '#EF4444',           // Danger Red
  info: '#0284C7',             // Information Blue
  
  // Nutrition & Energy Macros
  protein: '#0284C7',          // Electric Blue (Protein)
  carbs: '#06B6D4',            // Teal Cyan (Carbohydrates)
  fat: '#F59E0B',              // Amber Gold (Fats)
  fiber: '#8B5CF6',            // Violet (Fiber)
  water: '#0284C7',            // Clean Sky Blue (Hydration)
  calories: '#EA580C',         // Energy Orange (Calories)
};

export const Gradients = {
  primary: ['#0284C7', '#38BDF8'] as const,
  energy: ['#EA580C', '#F59E0B'] as const,
  power: ['#2563EB', '#0284C7'] as const,
  card: ['#FFFFFF', '#F0F9FF'] as const,
  cardElevated: ['#F0F9FF', '#E0F2FE'] as const,
  cyanBlue: ['#0284C7', '#38BDF8'] as const,
};

export default Palette;
