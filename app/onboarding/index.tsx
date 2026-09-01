import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { FitnessGoal, ActivityLevel, Gender } from '../../types';
import { calculateNutritionTargets } from '../../utils/calculations';

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, updateProfile } = useFitness();

  const [step, setStep] = useState(0);
  const [name, setName] = useState(user?.user_metadata?.full_name || profile.name || 'Alex Mercer');
  const [gender, setGender] = useState<Gender>(profile.gender || 'male');
  const [age, setAge] = useState(String(profile.age || 26));
  const [height, setHeight] = useState(String(profile.heightCm || 178));
  const [weight, setWeight] = useState(String(profile.weightKg || 78));
  const [targetWeight, setTargetWeight] = useState(String(profile.targetWeightKg || 75));
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile.fitnessGoal || 'build_muscle');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'very_active');
  const [trainingDays, setTrainingDays] = useState(profile.trainingDaysGoal || 5);
  const [loading, setLoading] = useState(false);

  const totalSteps = 6;

  const triggerStepHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const goals: { key: FitnessGoal; title: string; desc: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    {
      key: 'build_muscle',
      title: 'Build Muscle & Hypertrophy',
      desc: 'Gain lean muscle mass with surplus energy and high protein.',
      icon: 'barbell',
    },
    {
      key: 'lose_weight',
      title: 'Lose Fat & Get Lean',
      desc: 'Shed body fat through structured caloric deficit and strength.',
      icon: 'flame',
    },
    {
      key: 'increase_strength',
      title: 'Increase Raw Strength',
      desc: 'Focus on progressive overload on compound barbell movements.',
      icon: 'trophy',
    },
    {
      key: 'maintain',
      title: 'Maintain & Recompose',
      desc: 'Keep body weight steady while improving body composition.',
      icon: 'fitness',
    },
  ];

  const activities: { key: ActivityLevel; title: string; desc: string }[] = [
    { key: 'sedentary', title: 'Sedentary', desc: 'Little to no exercise, desk job' },
    { key: 'light', title: 'Lightly Active', desc: '1 to 3 light workout sessions / wk' },
    { key: 'moderate', title: 'Moderately Active', desc: '3 to 5 intense workouts / wk' },
    { key: 'very_active', title: 'Very Active', desc: '6 to 7 intense training sessions / wk' },
    { key: 'extra_active', title: 'Athlete / Physical Job', desc: 'Hard daily physical labor or training' },
  ];

  // Calculate live metabolic targets
  const ageNum = parseInt(age, 10) || 25;
  const heightNum = parseFloat(height) || 175;
  const weightNum = parseFloat(weight) || 75;
  const targetWeightNum = parseFloat(targetWeight) || 75;

  const targets = calculateNutritionTargets(
    gender,
    weightNum,
    heightNum,
    ageNum,
    activityLevel,
    fitnessGoal
  );

  const handleFinish = async () => {
    setLoading(true);
    await updateProfile({
      id: user ? user.id : profile.id,
      name: name.trim() || 'Alex',
      gender,
      age: ageNum,
      heightCm: heightNum,
      weightKg: weightNum,
      startWeightKg: weightNum,
      targetWeightKg: targetWeightNum,
      fitnessGoal,
      activityLevel,
      trainingDaysGoal: trainingDays,
      ...targets,
      isOnboarded: true,
    });
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Top Navigation & Step Indicator */}
        <View style={styles.topBar}>
          {step > 0 ? (
            <TouchableOpacity
              onPress={() => {
                triggerStepHaptic();
                setStep((s) => s - 1);
              }}
              style={styles.backBtn}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back to previous step"
            >
              <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 32 }} />
          )}

          <View style={styles.progressBarWrapper} accessibilityRole="progressbar">
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.min(100, ((step + 1) / totalSteps) * 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.stepCounter}>
            {step + 1}/{totalSteps}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* STEP 0: WELCOME */}
          {step === 0 && (
            <View style={styles.stepContainer}>
              <View style={[styles.brandBadge, Shadows.glowPrimary]}>
                <Ionicons name="flash" size={44} color={Palette.primary} />
              </View>
              <Text style={styles.brandTitle}>APEXFIT</Text>
              <Text style={styles.brandSubtitle}>Unified Workout & Nutrition Tracker</Text>
              <Text style={styles.welcomeDesc}>
                Calibrate your metabolic targets, log progressive overload lifting sessions, hit precision daily macros, and transform your body composition.
              </Text>

              <Button
                title="Let's Build Your Plan"
                onPress={() => {
                  triggerStepHaptic();
                  setStep(1);
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          )}

          {/* STEP 1: NAME & GOAL */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>What's your primary goal?</Text>
              <Text style={styles.stepSubtitle}>
                We'll personalize your calorie surplus/deficit and macro splits.
              </Text>

              <InputField
                label="Your Name"
                value={name}
                onChangeText={setName}
                placeholder="Alex Mercer"
                containerStyle={{ width: '100%', marginBottom: Spacing.md }}
              />

              <View style={styles.optionsList}>
                {goals.map((g) => (
                  <TouchableOpacity
                    key={g.key}
                    onPress={() => {
                      triggerStepHaptic();
                      setFitnessGoal(g.key);
                    }}
                    style={[
                      styles.goalOptionCard,
                      fitnessGoal === g.key && styles.goalOptionActive,
                    ]}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={g.title}
                    accessibilityState={{ selected: fitnessGoal === g.key }}
                  >
                    <View style={styles.goalIconCircle}>
                      <Ionicons
                        name={g.icon}
                        size={22}
                        color={fitnessGoal === g.key ? Palette.primary : Palette.textMuted}
                      />
                    </View>
                    <View style={styles.goalTextCol}>
                      <Text
                        style={[
                          styles.goalTitle,
                          fitnessGoal === g.key && styles.goalTitleActive,
                        ]}
                      >
                        {g.title}
                      </Text>
                      <Text style={styles.goalDesc}>{g.desc}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Continue"
                onPress={() => {
                  triggerStepHaptic();
                  setStep(2);
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          )}

          {/* STEP 2: GENDER & AGE */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Biological Profile</Text>
              <Text style={styles.stepSubtitle}>
                Used for Mifflin-St Jeor basal metabolic rate calculations.
              </Text>

              <View style={styles.genderRow}>
                {(['male', 'female', 'other'] as Gender[]).map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => {
                      triggerStepHaptic();
                      setGender(g);
                    }}
                    style={[
                      styles.genderBtn,
                      gender === g && styles.genderBtnActive,
                    ]}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={g}
                    accessibilityState={{ selected: gender === g }}
                  >
                    <Text
                      style={[
                        styles.genderBtnText,
                        gender === g && styles.genderBtnTextActive,
                      ]}
                    >
                      {g.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <InputField
                label="Age (Years)"
                value={age}
                onChangeText={setAge}
                keyboardType="number-pad"
                placeholder="26"
                containerStyle={{ width: '100%', marginTop: Spacing.sm }}
              />

              <Button
                title="Continue"
                onPress={() => {
                  triggerStepHaptic();
                  setStep(3);
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          )}

          {/* STEP 3: HEIGHT & WEIGHT */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Body Metrics</Text>
              <Text style={styles.stepSubtitle}>
                Enter your current measurements and target weight goal.
              </Text>

              <View style={styles.formRow}>
                <InputField
                  label="Height (cm)"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="number-pad"
                  placeholder="178"
                  containerStyle={{ flex: 1 }}
                />
                <InputField
                  label="Current Weight (kg)"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  placeholder="78"
                  containerStyle={{ flex: 1 }}
                />
              </View>

              <InputField
                label="Target Goal Weight (kg)"
                value={targetWeight}
                onChangeText={setTargetWeight}
                keyboardType="decimal-pad"
                placeholder="75"
                containerStyle={{ width: '100%' }}
              />

              <Button
                title="Continue"
                onPress={() => {
                  triggerStepHaptic();
                  setStep(4);
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          )}

          {/* STEP 4: ACTIVITY LEVEL */}
          {step === 4 && (
            <View style={styles.stepContainer}>
              <Text style={styles.stepTitle}>Activity & Training</Text>
              <Text style={styles.stepSubtitle}>
                Determines your Total Daily Energy Expenditure (TDEE).
              </Text>

              <View style={styles.optionsList}>
                {activities.map((a) => (
                  <TouchableOpacity
                    key={a.key}
                    onPress={() => {
                      triggerStepHaptic();
                      setActivityLevel(a.key);
                    }}
                    style={[
                      styles.goalOptionCard,
                      activityLevel === a.key && styles.goalOptionActive,
                    ]}
                    activeOpacity={0.8}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={a.title}
                    accessibilityState={{ selected: activityLevel === a.key }}
                  >
                    <View style={styles.goalTextCol}>
                      <Text
                        style={[
                          styles.goalTitle,
                          activityLevel === a.key && styles.goalTitleActive,
                        ]}
                      >
                        {a.title}
                      </Text>
                      <Text style={styles.goalDesc}>{a.desc}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <Button
                title="Calculate Plan"
                onPress={() => {
                  triggerStepHaptic();
                  setStep(5);
                }}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          )}

          {/* STEP 5: TARGET SHOWCASE & FINISH */}
          {step === 5 && (
            <View style={styles.stepContainer}>
              <View style={[styles.brandBadge, Shadows.glowPrimary]}>
                <Ionicons name="checkmark-done" size={44} color={Palette.primary} />
              </View>
              <Text style={styles.stepTitle}>Your Plan is Ready!</Text>
              <Text style={styles.stepSubtitle}>
                Calibrated specifically for {name}
              </Text>

              {/* Target Card */}
              <Card variant="highlight" style={styles.planCard}>
                <View style={styles.planCardHeader}>
                  <Text style={styles.planTargetCalVal}>{targets.targetCalories}</Text>
                  <Text style={styles.planTargetCalLbl}>DAILY KCAL TARGET</Text>
                </View>

                <View style={styles.planMacroRow}>
                  <View style={styles.planMacroItem}>
                    <Text style={[styles.planMacroVal, { color: Palette.protein }]}>
                      {targets.targetProteinG}g
                    </Text>
                    <Text style={styles.planMacroLbl}>Protein</Text>
                  </View>
                  <View style={styles.planMacroItem}>
                    <Text style={[styles.planMacroVal, { color: Palette.carbs }]}>
                      {targets.targetCarbsG}g
                    </Text>
                    <Text style={styles.planMacroLbl}>Carbs</Text>
                  </View>
                  <View style={styles.planMacroItem}>
                    <Text style={[styles.planMacroVal, { color: Palette.fat }]}>
                      {targets.targetFatG}g
                    </Text>
                    <Text style={styles.planMacroLbl}>Fat</Text>
                  </View>
                  <View style={styles.planMacroItem}>
                    <Text style={[styles.planMacroVal, { color: Palette.water }]}>
                      {Math.round((targets.targetWaterMl / 1000) * 10) / 10}L
                    </Text>
                    <Text style={styles.planMacroLbl}>Water</Text>
                  </View>
                </View>

                <View style={styles.bmrSubRow}>
                  <Text style={styles.bmrSubText}>
                    BMR: {targets.bmr} kcal • TDEE: {targets.tdee} kcal
                  </Text>
                </View>
              </Card>

              <Button
                title="Launch APEXFIT 🚀"
                onPress={handleFinish}
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  progressBarWrapper: {
    flex: 1,
    height: 4,
    backgroundColor: Palette.bgInput,
    borderRadius: 2,
    marginHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Palette.primary,
  },
  stepCounter: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  brandBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    color: Palette.textPrimary,
    fontSize: 32,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  welcomeDesc: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.body,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.md,
  },
  stepTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title1,
    fontWeight: Typography.fontWeights.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  stepSubtitle: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  optionsList: {
    width: '100%',
    gap: Spacing.sm,
  },
  goalOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: Spacing.md,
  },
  goalOptionActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  goalIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalTextCol: {
    flex: 1,
  },
  goalTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 2,
  },
  goalTitleActive: {
    color: Palette.primary,
  },
  goalDesc: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    lineHeight: 16,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    width: '100%',
    marginBottom: Spacing.md,
  },
  genderBtn: {
    flex: 1,
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  genderBtnActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  genderBtnText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  genderBtnTextActive: {
    color: Palette.textInverse,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
  },
  planCard: {
    width: '100%',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.sm,
  },
  planCardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  planTargetCalVal: {
    color: Palette.textPrimary,
    fontSize: 44,
    fontWeight: Typography.fontWeights.black,
  },
  planTargetCalLbl: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
  },
  planMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingVertical: Spacing.md,
  },
  planMacroItem: {
    alignItems: 'center',
  },
  planMacroVal: {
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.heavy,
  },
  planMacroLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  bmrSubRow: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  bmrSubText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
});
