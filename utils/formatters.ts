/**
 * Formats seconds into mm:ss or hh:mm:ss.
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}

/**
 * Formats seconds into timer clock style 00:00 or 00:00:00.
 */
export function formatClockTimer(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Formats a date string (YYYY-MM-DD) into user-friendly representation.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (dateString === today) return 'Today';
  if (dateString === yesterday) return 'Yesterday';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Formats full date with weekday and month.
 */
export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Converts kg to lbs or vice versa.
 */
export function formatWeight(
  weightKg: number,
  unit: 'kg' | 'lbs' = 'kg'
): string {
  if (unit === 'lbs') {
    const lbs = Math.round(weightKg * 2.20462 * 10) / 10;
    return `${lbs} lbs`;
  }
  return `${Math.round(weightKg * 10) / 10} kg`;
}

/**
 * Formats water in ml or oz.
 */
export function formatWater(
  amountMl: number,
  unit: 'ml' | 'oz' = 'ml'
): string {
  if (unit === 'oz') {
    const oz = Math.round(amountMl * 0.033814);
    return `${oz} oz`;
  }
  if (amountMl >= 1000) {
    return `${(amountMl / 1000).toFixed(1)} L`;
  }
  return `${Math.round(amountMl)} ml`;
}

/**
 * Formats numbers with commas (e.g. 12,450).
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}
