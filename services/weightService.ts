import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { WeightEntry } from '../types';

export const WeightService = {
  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (error || !data) return [];
      return data.map((d) => ({
        id: d.id,
        date: d.date,
        weightKg: d.weight_kg,
        note: d.note,
        timestamp: d.timestamp,
      }));
    } catch {
      return [];
    }
  },

  async upsertWeightEntry(entry: WeightEntry, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('weight_entries').upsert({
        id: entry.id,
        user_id: userId,
        date: entry.date,
        weight_kg: entry.weightKg,
        note: entry.note,
        timestamp: entry.timestamp,
      });
    } catch (e) {
      console.warn('WeightService.upsertWeightEntry error:', e);
    }
  },

  async deleteWeightEntry(entryId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('weight_entries').delete().eq('id', entryId);
    } catch (e) {
      console.warn('WeightService.deleteWeightEntry error:', e);
    }
  },
};
