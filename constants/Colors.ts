export const Palette = {
  // Brand / Core accents
  primary: '#00F59B', // Neon Jade / Emerald
  primaryDark: '#059669',
  primaryGlow: 'rgba(0, 245, 155, 0.18)',
  
  cyan: '#00D2FF', // Cyber Cyan
  cyanGlow: 'rgba(0, 210, 255, 0.18)',
  
  blue: '#3B82F6', // Electric Blue
  blueDark: '#1D4ED8',
  
  orange: '#FF6B00', // Energy Orange
  amber: '#F59E0B', // Gold PRs
  
  purple: '#8B5CF6', // Accent Violet
  purpleGlow: 'rgba(139, 92, 246, 0.18)',
  
  rose: '#F43F5E', // Calorie Burn / Intensity
  
  // Backgrounds & Surfaces (Dark-First)
  bgApp: '#080B11',
  bgCard: '#111726',
  bgCardHover: '#161F33',
  bgCardElevated: '#1A233A',
  bgInput: '#131A2B',
  bgModal: '#0F1524',
  
  // Borders & Dividers
  borderSubtle: '#1C253B',
  borderDefault: '#263350',
  borderHighlight: '#334469',
  borderActive: '#00F59B',
  
  // Text Colors
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDisabled: '#475569',
  textInverse: '#080B11',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  
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
  power: ['#8B5CF6', '#3B82F6'] as const,
  card: ['#121828', '#0C101B'] as const,
  cardElevated: ['#1A243D', '#12192B'] as const,
  fire: ['#F43F5E', '#FF6B00'] as const,
  cyanBlue: ['#00D2FF', '#3B82F6'] as const,
  darkOverlay: ['rgba(8,11,17,0)', 'rgba(8,11,17,0.95)'] as const,
};

export default Palette;
