import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { WaterLog } from '../types';

export const WaterService = {
  async getWaterLogs(userId: string): Promise<WaterLog[]> {
    if (!isSupabaseConfigured()) return [];
    try {
      const { data, error } = await supabase
        .from('water_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

      if (error || !data) return [];
      return data.map((d) => ({
        id: d.id,
        date: d.date,
        amountMl: d.amount_ml,
        timestamp: d.timestamp,
      }));
    } catch {
      return [];
    }
  },

  async upsertWaterLog(log: WaterLog, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      await supabase.from('water_logs').upsert({
        id: log.id,
        user_id: userId,
        date: log.date,
        amount_ml: log.amountMl,
        timestamp: log.timestamp,
      });
    } catch (e) {
      console.warn('WaterService.upsertWaterLog error:', e);
    }
  },
};
