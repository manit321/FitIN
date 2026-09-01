export const DarkPalette = {
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
  
  // Backgrounds & Surfaces (Obsidian Matte)
  bgApp: '#090B10',
  bgCard: '#111520',
  bgCardElevated: '#171D2C',
  bgCardHover: '#1B2335',
  bgInput: '#131826',
  bgModal: '#0E121B',
  
  // Borders & Dividers
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

export const LightPalette = {
  // Brand / Signature Accents (High Contrast on Light)
  primary: '#059669',       // Deep Emerald / Jade
  primaryDark: '#047857',
  primaryMuted: 'rgba(5, 150, 105, 0.10)',
  primaryGlow: 'rgba(5, 150, 105, 0.20)',
  
  cyan: '#0284C7',          // Crisp Sky Blue
  cyanMuted: 'rgba(2, 132, 199, 0.10)',
  
  orange: '#EA580C',        // Deep Orange
  orangeMuted: 'rgba(234, 88, 12, 0.10)',
  
  amber: '#D97706',         // Deep Amber Gold
  amberMuted: 'rgba(217, 119, 6, 0.10)',
  
  purple: '#7C3AED',        // Royal Violet
  purpleMuted: 'rgba(124, 58, 237, 0.10)',
  
  rose: '#E11D48',
  roseMuted: 'rgba(225, 29, 72, 0.10)',

  blue: '#0284C7',
  blueMuted: 'rgba(2, 132, 199, 0.10)',
  
  // Backgrounds & Surfaces (Apple Health Clean Snow)
  bgApp: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardElevated: '#F1F5F9',
  bgCardHover: '#E2E8F0',
  bgInput: '#F1F5F9',
  bgModal: '#FFFFFF',
  
  // Borders & Dividers
  borderSubtle: 'rgba(0, 0, 0, 0.06)',
  borderDefault: 'rgba(0, 0, 0, 0.12)',
  borderHighlight: 'rgba(5, 150, 105, 0.35)',
  borderActive: '#059669',
  
  // Typography Hierarchy
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textDisabled: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#0284C7',
  
  // Macros
  protein: '#059669',
  carbs: '#0284C7',
  fat: '#D97706',
  fiber: '#7C3AED',
  water: '#0284C7',
  calories: '#EA580C',
};

export const Palette = DarkPalette;

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
