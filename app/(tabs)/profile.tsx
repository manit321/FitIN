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
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ModalWrapper } from '../../components/ui/ModalWrapper';
import { InputField } from '../../components/ui/InputField';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatWeight } from '../../utils/formatters';
import { FitnessGoal, ActivityLevel } from '../../types';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile,
    settings,
    updateProfile,
    updateSettings,
    resetAllData,
  } = useFitness();

  const [isEditProfileVisible, setIsEditProfileVisible] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(String(profile.age));
  const [editHeight, setEditHeight] = useState(String(profile.heightCm));
  const [editWeight, setEditWeight] = useState(String(profile.weightKg));
  const [editTargetWeight, setEditTargetWeight] = useState(String(profile.targetWeightKg));
  const [editGoal, setEditGoal] = useState<FitnessGoal>(profile.fitnessGoal);
  const [editActivity, setEditActivity] = useState<ActivityLevel>(profile.activityLevel);

  const goalLabels: Record<FitnessGoal, string> = {
    build_muscle: 'Build Muscle',
    lose_weight: 'Lose Weight / Cut',
    maintain: 'Maintain Weight',
    increase_strength: 'Increase Strength',
    improve_fitness: 'Improve Fitness',
    increase_frequency: 'Increase Frequency',
  };

  const activityLabels: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary (Desk Job)',
    light: 'Lightly Active (1-3 days/wk)',
    moderate: 'Moderately Active (3-5 days/wk)',
    very_active: 'Very Active (6-7 days/wk)',
    extra_active: 'Athlete / Physical Work',
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      name: editName.trim() || profile.name,
      age: parseInt(editAge, 10) || profile.age,
      heightCm: parseFloat(editHeight) || profile.heightCm,
      weightKg: parseFloat(editWeight) || profile.weightKg,
      targetWeightKg: parseFloat(editTargetWeight) || profile.targetWeightKg,
      fitnessGoal: editGoal,
      activityLevel: editActivity,
    });
    setIsEditProfileVisible(false);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset to Sample Data',
      'This will reload fresh workouts, exercises, nutrition logs, and weight history. Continue?',
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader subtitle="ACCOUNT & SETTINGS" title="Profile" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* USER INFO CARD */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileGoalBadge}>
                {goalLabels[profile.fitnessGoal]}
              </Text>
              <Text style={styles.profileBio}>
                {profile.age} yrs • {profile.heightCm} cm •{' '}
                {formatWeight(profile.weightKg, settings.weightUnit)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setEditName(profile.name);
                setEditAge(String(profile.age));
                setEditHeight(String(profile.heightCm));
                setEditWeight(String(profile.weightKg));
                setEditTargetWeight(String(profile.targetWeightKg));
                setEditGoal(profile.fitnessGoal);
                setEditActivity(profile.activityLevel);
                setIsEditProfileVisible(true);
              }}
              style={styles.editBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={18} color={Palette.primary} />
            </TouchableOpacity>
          </View>

          {/* Weight Targets Grid */}
          <View style={styles.weightGoalsRow}>
            <View style={styles.weightGoalBox}>
              <Text style={styles.weightGoalVal}>{profile.startWeightKg} kg</Text>
              <Text style={styles.weightGoalLabel}>Starting</Text>
            </View>
            <View style={styles.weightGoalBox}>
              <Text style={[styles.weightGoalVal, { color: Palette.primary }]}>
                {profile.weightKg} kg
              </Text>
              <Text style={styles.weightGoalLabel}>Current</Text>
            </View>
            <View style={styles.weightGoalBox}>
              <Text style={[styles.weightGoalVal, { color: Palette.cyan }]}>
                {profile.targetWeightKg} kg
              </Text>
              <Text style={styles.weightGoalLabel}>Target</Text>
            </View>
          </View>
        </Card>

        {/* METABOLIC / ENERGY TARGETS */}
        <Card variant="default" style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Calculated Energy & Macros</Text>
            <Ionicons name="calculator-outline" size={20} color={Palette.primary} />
          </View>

          <View style={styles.energyGrid}>
            <View style={styles.energyItem}>
              <Text style={styles.energyVal}>{profile.bmr}</Text>
              <Text style={styles.energyLabel}>BMR (kcal)</Text>
            </View>
            <View style={styles.energyItem}>
              <Text style={styles.energyVal}>{profile.tdee}</Text>
              <Text style={styles.energyLabel}>TDEE (kcal)</Text>
            </View>
            <View style={styles.energyItem}>
              <Text style={[styles.energyVal, { color: Palette.orange }]}>
                {profile.targetCalories}
              </Text>
              <Text style={styles.energyLabel}>Target (kcal)</Text>
            </View>
          </View>

          <View style={styles.macroPillsRow}>
            <Badge
              label={`Protein: ${profile.targetProteinG}g`}
              variant="primary"
              size="sm"
            />
            <Badge
              label={`Carbs: ${profile.targetCarbsG}g`}
              variant="cyan"
              size="sm"
            />
            <Badge
              label={`Fat: ${profile.targetFatG}g`}
              variant="orange"
              size="sm"
            />
            <Badge
              label={`Water: ${profile.targetWaterMl}ml`}
              variant="muted"
              size="sm"
            />
          </View>
        </Card>

        {/* UNITS & PREFERENCES */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences & Units</Text>

          {/* Weight Unit */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Weight Unit</Text>
              <Text style={styles.settingSub}>Choose kilograms or pounds</Text>
            </View>
            <View style={styles.unitToggleGroup}>
              <TouchableOpacity
                onPress={() => updateSettings({ weightUnit: 'kg' })}
                style={[
                  styles.unitPill,
                  settings.weightUnit === 'kg' && styles.unitPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.weightUnit === 'kg' && styles.unitTextActive,
                  ]}
                >
                  KG
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateSettings({ weightUnit: 'lbs' })}
                style={[
                  styles.unitPill,
                  settings.weightUnit === 'lbs' && styles.unitPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.weightUnit === 'lbs' && styles.unitTextActive,
                  ]}
                >
                  LBS
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Water Unit */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Water Unit</Text>
              <Text style={styles.settingSub}>Milliliters or fluid ounces</Text>
            </View>
            <View style={styles.unitToggleGroup}>
              <TouchableOpacity
                onPress={() => updateSettings({ waterUnit: 'ml' })}
                style={[
                  styles.unitPill,
                  settings.waterUnit === 'ml' && styles.unitPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.waterUnit === 'ml' && styles.unitTextActive,
                  ]}
                >
                  ML
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateSettings({ waterUnit: 'oz' })}
                style={[
                  styles.unitPill,
                  settings.waterUnit === 'oz' && styles.unitPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.unitText,
                    settings.waterUnit === 'oz' && styles.unitTextActive,
                  ]}
                >
                  OZ
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Haptics */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Haptic Feedback</Text>
              <Text style={styles.settingSub}>Tactile feedback on set completion</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(val) => updateSettings({ hapticsEnabled: val })}
              trackColor={{ false: Palette.bgInput, true: Palette.primary }}
              thumbColor={Palette.textPrimary}
            />
          </View>

          {/* Rest Timer Auto Start */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto Rest Timer</Text>
              <Text style={styles.settingSub}>Trigger countdown on completed set</Text>
            </View>
            <Switch
              value={settings.restTimerAutoStart}
              onValueChange={(val) => updateSettings({ restTimerAutoStart: val })}
              trackColor={{ false: Palette.bgInput, true: Palette.primary }}
              thumbColor={Palette.textPrimary}
            />
          </View>
        </Card>

        {/* DATA MANAGEMENT */}
        <Card variant="default" style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Text style={styles.settingSub}>
            All APEXFIT data is stored 100% locally and works offline.
          </Text>

          <Button
            title="Reload Sample Data"
            onPress={handleResetData}
            variant="secondary"
            icon={<Ionicons name="refresh-outline" size={18} color={Palette.textPrimary} />}
            style={styles.dataBtn}
          />
        </Card>

        {/* ABOUT APEXFIT */}
        <Card variant="default" style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>APEXFIT iOS</Text>
          <Text style={styles.aboutSub}>
            Unified Workout & Nutrition Tracker • v1.0.0 (Expo SDK 54)
          </Text>
        </Card>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <ModalWrapper
        visible={isEditProfileVisible}
        onClose={() => setIsEditProfileVisible(false)}
        title="Edit Profile"
        subtitle="Update biometrics and targets"
        scrollable
      >
        <InputField
          label="Full Name"
          value={editName}
          onChangeText={setEditName}
          placeholder="Ethan Brooks"
        />

        <View style={styles.formRow}>
          <InputField
            label="Age"
            value={editAge}
            onChangeText={setEditAge}
            keyboardType="number-pad"
            unitSuffix="yrs"
            containerStyle={styles.formCol}
          />
          <InputField
            label="Height"
            value={editHeight}
            onChangeText={setEditHeight}
            keyboardType="number-pad"
            unitSuffix="cm"
            containerStyle={styles.formCol}
          />
        </View>

        <View style={styles.formRow}>
          <InputField
            label="Current Weight"
            value={editWeight}
            onChangeText={setEditWeight}
            keyboardType="decimal-pad"
            unitSuffix="kg"
            containerStyle={styles.formCol}
          />
          <InputField
            label="Goal Weight"
            value={editTargetWeight}
            onChangeText={setEditTargetWeight}
            keyboardType="decimal-pad"
            unitSuffix="kg"
            containerStyle={styles.formCol}
          />
        </View>

        {/* Goal Selector */}
        <Text style={styles.formSectionLabel}>Primary Fitness Goal</Text>
        {(Object.keys(goalLabels) as FitnessGoal[]).map((g) => (
          <TouchableOpacity
            key={g}
            onPress={() => setEditGoal(g)}
            style={[
              styles.optionPill,
              editGoal === g && styles.optionPillActive,
            ]}
          >
            <Text
              style={[
                styles.optionPillText,
                editGoal === g && styles.optionPillTextActive,
              ]}
            >
              {goalLabels[g]}
            </Text>
            {editGoal === g && (
              <Ionicons name="checkmark-circle" size={18} color={Palette.primary} />
            )}
          </TouchableOpacity>
        ))}

        {/* Activity Level Selector */}
        <Text style={styles.formSectionLabel}>Activity Level</Text>
        {(Object.keys(activityLabels) as ActivityLevel[]).map((act) => (
          <TouchableOpacity
            key={act}
            onPress={() => setEditActivity(act)}
            style={[
              styles.optionPill,
              editActivity === act && styles.optionPillActive,
            ]}
          >
            <Text
              style={[
                styles.optionPillText,
                editActivity === act && styles.optionPillTextActive,
              ]}
            >
              {activityLabels[act]}
            </Text>
            {editActivity === act && (
              <Ionicons name="checkmark-circle" size={18} color={Palette.primary} />
            )}
          </TouchableOpacity>
        ))}

        <Button
          title="Save Changes"
          onPress={handleSaveProfile}
          variant="primary"
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
    paddingBottom: Spacing.xxxl,
  },
  profileCard: {
    marginBottom: Spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarInitial: {
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.heavy,
    color: Palette.textInverse,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
  profileGoalBadge: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    marginTop: 2,
  },
  profileBio: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  editBtn: {
    padding: Spacing.xs,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  weightGoalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  weightGoalBox: {
    alignItems: 'center',
  },
  weightGoalVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.heavy,
  },
  weightGoalLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  sectionCard: {
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  energyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  energyItem: {
    alignItems: 'center',
  },
  energyVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  energyLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  macroPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  settingInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.semibold,
  },
  settingSub: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  unitToggleGroup: {
    flexDirection: 'row',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    padding: 2,
  },
  unitPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.xs,
  },
  unitPillActive: {
    backgroundColor: Palette.primary,
  },
  unitText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  unitTextActive: {
    color: Palette.textInverse,
  },
  dataBtn: {
    marginTop: Spacing.md,
  },
  aboutCard: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  aboutTitle: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
  },
  aboutSub: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 4,
    textAlign: 'center',
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  formCol: {
    flex: 1,
  },
  formSectionLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  optionPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  optionPillActive: {
    borderColor: Palette.primary,
    backgroundColor: 'rgba(0, 245, 155, 0.08)',
  },
  optionPillText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  optionPillTextActive: {
    color: Palette.primary,
    fontWeight: Typography.fontWeights.bold,
  },
});
