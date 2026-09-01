import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatDate, formatWeight } from '../../utils/formatters';

export default function LogWeightScreen() {
  const router = useRouter();
  const { profile, settings, weightEntries, logWeight, deleteWeightEntry } = useFitness();

  const todayStr = new Date().toISOString().split('T')[0];
  const [weight, setWeight] = useState(String(profile.weightKg));
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const parsedWeight = parseFloat(weight) || profile.weightKg;
  const startWeight = profile.startWeightKg;
  const goalWeight = profile.targetWeightKg;
  const totalDelta = Math.round((parsedWeight - startWeight) * 10) / 10;
  const toGoalDelta = Math.round((parsedWeight - goalWeight) * 10) / 10;

  const handleSave = async () => {
    const num = parseFloat(weight);
    if (!num || num <= 20 || num >= 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid body weight between 20 and 300 kg.');
      return;
    }
    await logWeight(num, note.trim() || undefined, selectedDate);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelBtn}
          activeOpacity={0.7}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Body Weight</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* WEIGHT HERO INPUT */}
        <Card variant="elevated" style={styles.inputCard}>
          <Text style={styles.inputCardLabel}>TODAY'S WEIGH-IN</Text>
          <View style={styles.weightInputRow}>
            <TextInput
              style={styles.bigWeightInput}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
              selectTextOnFocus
            />
            <Text style={styles.bigUnitLabel}>{settings.weightUnit}</Text>
          </View>

          {/* DELTA PREVIEWS */}
          <View style={styles.deltaGrid}>
            <View style={styles.deltaBox}>
              <Text
                style={[
                  styles.deltaVal,
                  { color: totalDelta <= 0 ? Palette.success : Palette.warning },
                ]}
              >
                {totalDelta > 0 ? `+${totalDelta}` : totalDelta} kg
              </Text>
              <Text style={styles.deltaLbl}>From Start</Text>
            </View>
            <View style={styles.deltaBox}>
              <Text style={styles.deltaVal}>
                {toGoalDelta > 0 ? `${toGoalDelta} to go` : 'Goal Reached!'}
              </Text>
              <Text style={styles.deltaLbl}>To Goal ({goalWeight} kg)</Text>
            </View>
          </View>
        </Card>

        {/* OPTIONAL NOTE */}
        <InputField
          label="Weigh-in Note (Optional)"
          value={note}
          onChangeText={setNote}
          placeholder="e.g. Fasted morning weigh-in after rest day"
        />

        <Button
          title="Save Weigh-in"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          icon={<Ionicons name="scale" size={20} color={Palette.textInverse} />}
          style={{ marginVertical: Spacing.md }}
        />

        {/* RECENT WEIGHT HISTORY */}
        <Text style={styles.historyTitle}>Recent Weigh-ins</Text>
        {weightEntries
          .slice()
          .reverse()
          .map((entry) => (
            <View key={entry.id} style={styles.historyRow}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                {entry.note && <Text style={styles.historyNote}>{entry.note}</Text>}
              </View>
              <Text style={styles.historyVal}>
                {formatWeight(entry.weightKg, settings.weightUnit)}
              </Text>
              <TouchableOpacity
                onPress={() => deleteWeightEntry(entry.id)}
                style={styles.delEntryBtn}
              >
                <Ionicons name="trash-outline" size={16} color={Palette.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  cancelBtn: {
    padding: Spacing.xs,
  },
  cancelText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.body,
  },
  headerTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  inputCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  inputCardLabel: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  bigWeightInput: {
    color: Palette.textPrimary,
    fontSize: 54,
    fontWeight: Typography.fontWeights.black,
    textAlign: 'center',
    minWidth: 140,
  },
  bigUnitLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: 6,
  },
  deltaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  deltaBox: {
    alignItems: 'center',
  },
  deltaVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
  },
  deltaLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  historyTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  historyNote: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  historyVal: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
    marginRight: Spacing.md,
  },
  delEntryBtn: {
    padding: Spacing.xs,
  },
});
