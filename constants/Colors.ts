export const Palette = {
  // Brand / Signature Accents (Apple Fitness / Whoop Inspired)
  primary: '#00F59B',       // Luminous Electric Jade
  primaryDark: '#059669',
  primaryMuted: 'rgba(0, 245, 155, 0.12)',
  primaryGlow: 'rgba(0, 245, 155, 0.22)',
  
  cyan: '#00D2FF',          // Cyber Cyan
  cyanMuted: 'rgba(0, 210, 255, 0.12)',
  
  orange: '#FF6B00',        // Energy Orange (Calories / Burn)
  orangeMuted: 'rgba(255, 107, 0, 0.12)',
  
  amber: '#F59E0B',         // Gold PRs & Trophies
  amberMuted: 'rgba(245, 158, 11, 0.12)',
  
  purple: '#8B5CF6',        // Accent Violet
  purpleMuted: 'rgba(139, 92, 246, 0.12)',
  
  rose: '#F43F5E',          // High Intensity / Heart Rate
  roseMuted: 'rgba(244, 63, 94, 0.12)',

  blue: '#38BDF8',          // Clean Hydration Blue
  blueMuted: 'rgba(56, 189, 248, 0.12)',
  
  // Backgrounds & Refined Surfaces (Dark-First, Clean Matte Obsidian)
  bgApp: '#090B10',          // Deepest background
  bgCard: '#111520',         // Surface level 1 (subtle & elegant)
  bgCardElevated: '#171D2C', // Surface level 2 (interactive / active)
  bgCardHover: '#1B2335',
  bgInput: '#131826',        // Form & input backgrounds
  bgModal: '#0E121B',        // Bottom sheets & modal sheets
  
  // Clean Hairline Borders & Dividers (Subtle, never heavy)
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderDefault: 'rgba(255, 255, 255, 0.10)',
  borderHighlight: 'rgba(0, 245, 155, 0.35)',
  borderActive: '#00F59B',
  
  // Typography Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',
  textInverse: '#090B10',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#38BDF8',
  
  // Macros
  protein: '#00F59B',
  carbs: '#00D2FF',
  fat: '#F59E0B',
  fiber: '#A78BFA',
  water: '#38BDF8',
  calories: '#FF6B00',
};

export const Gradients = {
  primary: ['#00F59B', '#00D2FF'] as const,
  energy: ['#FF6B00', '#F59E0B'] as const,
  power: ['#8B5CF6', '#38BDF8'] as const,
  card: ['#121622', '#0D1017'] as const,
  cardElevated: ['#181E2E', '#111522'] as const,
  fire: ['#F43F5E', '#FF6B00'] as const,
  cyanBlue: ['#00D2FF', '#38BDF8'] as const,
  darkOverlay: ['rgba(9,11,16,0)', 'rgba(9,11,16,0.95)'] as const,
};

export default Palette;
