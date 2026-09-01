import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ModalWrapper } from '../../components/ui/ModalWrapper';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { FitnessGoal, ActivityLevel, Gender } from '../../types';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    profile,
    settings,
    updateProfile,
    updateSettings,
    resetAllData,
    syncWithCloud,
  } = useFitness();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(String(profile.age));
  const [editHeight, setEditHeight] = useState(String(profile.heightCm));
  const [editWeight, setEditWeight] = useState(String(profile.weightKg));
  const [editTargetWeight, setEditTargetWeight] = useState(String(profile.targetWeightKg));
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSaveProfile = async () => {
    await updateProfile({
      name: editName.trim() || profile.name,
      age: parseInt(editAge, 10) || profile.age,
      heightCm: parseFloat(editHeight) || profile.heightCm,
      weightKg: parseFloat(editWeight) || profile.weightKg,
      targetWeightKg: parseFloat(editTargetWeight) || profile.targetWeightKg,
    });
    setIsEditModalOpen(false);
  };

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    await syncWithCloud();
    setIsSyncing(false);
    Alert.alert('Cloud Sync', 'Your fitness data has been synchronized with Supabase.');
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all data back to original sample records?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => resetAllData(),
        },
      ]
    );
  };

  const goalLabels: Record<FitnessGoal, string> = {
    build_muscle: 'Hypertrophy / Muscle Gain',
    lose_weight: 'Fat Loss / Deficit',
    increase_strength: 'Powerlifting / Strength',
    maintain: 'Recomposition / Maintain',
    improve_fitness: 'Endurance & Fitness',
    increase_frequency: 'Workout Consistency',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AppHeader
          title="Profile"
          subtitle="SETTINGS & METRICS"
          rightAction={
            <TouchableOpacity
              onPress={() => setIsEditModalOpen(true)}
              style={styles.editBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="pencil" size={15} color={Palette.textInverse} />
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          }
        />

        {/* HERO BIO CARD */}
        <Card variant="elevated" style={styles.heroCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={32} color={Palette.primary} />
          </View>
          <Text style={styles.heroName}>{profile.name}</Text>
          <View style={styles.badgeRow}>
            <Badge label={goalLabels[profile.fitnessGoal] || 'Fitness'} variant="primary" size="sm" />
            <Badge label={`${profile.trainingDaysGoal} days / wk`} variant="cyan" size="sm" />
          </View>

          {/* Quick Metrics Strip */}
          <View style={styles.quickMetricsStrip}>
            <View style={styles.stripCol}>
              <Text style={styles.stripVal}>{profile.weightKg} kg</Text>
              <Text style={styles.stripLbl}>Current</Text>
            </View>
            <View style={styles.stripCol}>
              <Text style={styles.stripVal}>{profile.heightCm} cm</Text>
              <Text style={styles.stripLbl}>Height</Text>
            </View>
            <View style={styles.stripCol}>
              <Text style={styles.stripVal}>{profile.targetCalories}</Text>
              <Text style={styles.stripLbl}>Daily kcal</Text>
            </View>
            <View style={styles.stripCol}>
              <Text style={[styles.stripVal, { color: Palette.primary }]}>
                {profile.targetProteinG}g
              </Text>
              <Text style={styles.stripLbl}>Protein</Text>
            </View>
          </View>
        </Card>

        {/* METABOLIC CALIBRATION */}
        <Text style={styles.sectionHeading}>Metabolic Calibration</Text>
        <Card variant="default" style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="flame-outline" size={20} color={Palette.orange} />
              <View>
                <Text style={styles.settingTitle}>Basal Metabolic Rate (BMR)</Text>
                <Text style={styles.settingSub}>Calories burned at rest</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{profile.bmr} kcal</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="flash-outline" size={20} color={Palette.cyan} />
              <View>
                <Text style={styles.settingTitle}>Total Daily Energy (TDEE)</Text>
                <Text style={styles.settingSub}>Maintenance calories</Text>
              </View>
            </View>
            <Text style={styles.settingValue}>{profile.tdee} kcal</Text>
          </View>
        </Card>

        {/* APP PREFERENCES */}
        <Text style={styles.sectionHeading}>Preferences</Text>
        <Card variant="default" style={styles.groupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color={Palette.primary} />
              <Text style={styles.settingTitle}>Haptic Feedback</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(val) => updateSettings({ hapticsEnabled: val })}
              trackColor={{ false: Palette.bgInput, true: Palette.primary }}
              thumbColor={Palette.textPrimary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="timer-outline" size={20} color={Palette.amber} />
              <Text style={styles.settingTitle}>Auto Start Rest Timer</Text>
            </View>
            <Switch
              value={settings.restTimerAutoStart}
              onValueChange={(val) => updateSettings({ restTimerAutoStart: val })}
              trackColor={{ false: Palette.bgInput, true: Palette.primary }}
              thumbColor={Palette.textPrimary}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="scale-outline" size={20} color={Palette.purple} />
              <Text style={styles.settingTitle}>Weight Unit</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                updateSettings({
                  weightUnit: settings.weightUnit === 'kg' ? 'lbs' : 'kg',
                })
              }
              style={styles.unitBtn}
            >
              <Text style={styles.unitBtnText}>{settings.weightUnit.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* CLOUD & DATA MANAGEMENT */}
        <Text style={styles.sectionHeading}>Cloud & Data</Text>
        <Card variant="default" style={styles.groupCard}>
          <TouchableOpacity
            onPress={handleSyncCloud}
            style={styles.settingRow}
            disabled={isSyncing}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="cloud-upload-outline" size={20} color={Palette.primary} />
              <Text style={styles.settingTitle}>
                {isSyncing ? 'Syncing...' : 'Sync with Supabase Cloud'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={handleReset} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={20} color={Palette.danger} />
              <Text style={[styles.settingTitle, { color: Palette.danger }]}>
                Reset Sample Data
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            onPress={() => {
              Alert.alert('Log Out', 'Are you sure you want to log out of APEXFIT?', [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/login');
                  },
                },
              ]);
            }}
            style={styles.settingRow}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={20} color={Palette.orange} />
              <Text style={[styles.settingTitle, { color: Palette.orange }]}>
                Log Out
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.textMuted} />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <ModalWrapper
        visible={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        subtitle="Update your biometrics"
      >
        <InputField
          label="Full Name"
          value={editName}
          onChangeText={setEditName}
          placeholder="Alex Mercer"
        />
        <InputField
          label="Age"
          value={editAge}
          onChangeText={setEditAge}
          keyboardType="number-pad"
        />
        <InputField
          label="Height (cm)"
          value={editHeight}
          onChangeText={setEditHeight}
          keyboardType="number-pad"
        />
        <InputField
          label="Current Weight (kg)"
          value={editWeight}
          onChangeText={setEditWeight}
          keyboardType="decimal-pad"
        />
        <InputField
          label="Target Goal Weight (kg)"
          value={editTargetWeight}
          onChangeText={setEditTargetWeight}
          keyboardType="decimal-pad"
        />
        <Button
          title="Save Changes"
          onPress={handleSaveProfile}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: Spacing.md }}
        />
      </ModalWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  editBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
  },
  avatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  heroName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  quickMetricsStrip: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    borderTopWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingTop: Spacing.md,
  },
  stripCol: {
    alignItems: 'center',
  },
  stripVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  stripLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    marginTop: 2,
  },
  sectionHeading: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 0.5,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  groupCard: {
    marginBottom: Spacing.md,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  settingTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.medium,
  },
  settingSub: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 1,
  },
  settingValue: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.borderSubtle,
  },
  unitBtn: {
    backgroundColor: Palette.bgInput,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  unitBtnText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
});
