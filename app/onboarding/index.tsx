import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { InputField } from '../../components/ui/InputField';
import { Badge } from '../../components/ui/Badge';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { FitnessGoal, ActivityLevel, Gender } from '../../types';
import { calculateNutritionTargets } from '../../utils/calculations';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile } = useFitness();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('Alex Mercer');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState('26');
  const [height, setHeight] = useState('178');
  const [weight, setWeight] = useState('78');
  const [targetWeight, setTargetWeight] = useState('75');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('build_muscle');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('very_active');
  const [trainingDays, setTrainingDays] = useState(5);

  const totalSteps = 7;

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
    { key: 'light', title: 'Lightly Active', desc: '1 to 3 light workout sessions/wk' },
    { key: 'moderate', title: 'Moderately Active', desc: '3 to 5 intense workouts/wk' },
    { key: 'very_active', title: 'Very Active', desc: '6 to 7 intense training sessions/wk' },
    { key: 'extra_active', title: 'Athlete / Physical Job', desc: 'Hard daily physical labor or training' },
  ];

  // Calculate live targets
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
    await updateProfile({
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

    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Navigation & Step Indicator */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <TouchableOpacity
            onPress={() => setStep((s) => s - 1)}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}

        <View style={styles.progressBarWrapper}>
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
      >
        {/* STEP 0: WELCOME */}
        {step === 0 && (
          <View style={styles.stepContainer}>
            <View style={[styles.brandBadge, Shadows.glowPrimary]}>
              <Ionicons name="flash" size={48} color={Palette.primary} />
            </View>
            <Text style={styles.brandTitle}>APEXFIT</Text>
            <Text style={styles.brandSubtitle}>
              Unified Workout & Nutrition Tracker
            </Text>
            <Text style={styles.welcomeDesc}>
              Track heavy progressive overload, hit precision macros, maintain
              hydration streaks, and transform your physique.
            </Text>

            <Button
              title="Let's Build Your Plan"
              onPress={() => setStep(1)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 1: NAME */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What is your name?</Text>
            <Text style={styles.stepSubtitle}>
              Personalize your dashboard experience.
            </Text>

            <InputField
              label="Your Full Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Alex Mercer"
              containerStyle={{ width: '100%', marginTop: Spacing.lg }}
            />

            <Button
              title="Continue"
              onPress={() => setStep(2)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 2: PRIMARY GOAL */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your primary goal?</Text>
            <Text style={styles.stepSubtitle}>
              We'll calibrate your calorie deficit/surplus and macros.
            </Text>

            <View style={styles.optionsList}>
              {goals.map((g) => (
                <TouchableOpacity
                  key={g.key}
                  onPress={() => setFitnessGoal(g.key)}
                  style={[
                    styles.goalOptionCard,
                    fitnessGoal === g.key && styles.goalOptionActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.goalIconCircle}>
                    <Ionicons
                      name={g.icon}
                      size={24}
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
              onPress={() => setStep(3)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 3: GENDER & AGE */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Biological Profile</Text>
            <Text style={styles.stepSubtitle}>
              Used for precise Mifflin-St Jeor metabolic calculations.
            </Text>

            <View style={styles.genderRow}>
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={[
                    styles.genderBtn,
                    gender === g && styles.genderBtnActive,
                  ]}
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
              containerStyle={{ width: '100%', marginTop: Spacing.md }}
            />

            <Button
              title="Continue"
              onPress={() => setStep(4)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 4: HEIGHT & WEIGHT */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Body Metrics</Text>
            <Text style={styles.stepSubtitle}>
              Enter your current height and body weight.
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
              onPress={() => setStep(5)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 5: ACTIVITY LEVEL */}
        {step === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Daily Activity Level</Text>
            <Text style={styles.stepSubtitle}>
              Determines your Total Daily Energy Expenditure (TDEE).
            </Text>

            <View style={styles.optionsList}>
              {activities.map((a) => (
                <TouchableOpacity
                  key={a.key}
                  onPress={() => setActivityLevel(a.key)}
                  style={[
                    styles.goalOptionCard,
                    activityLevel === a.key && styles.goalOptionActive,
                  ]}
                  activeOpacity={0.8}
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
              onPress={() => setStep(6)}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.xl }}
            />
          </View>
        )}

        {/* STEP 6: TARGETS SHOWCASE & FINISH */}
        {step === 6 && (
          <View style={styles.stepContainer}>
            <View style={[styles.brandBadge, Shadows.glowPrimary]}>
              <Ionicons name="checkmark-done" size={48} color={Palette.primary} />
            </View>
            <Text style={styles.stepTitle}>Your Plan is Ready!</Text>
            <Text style={styles.stepSubtitle}>
              Calibrated specifically for {name}
            </Text>

            {/* Target Matrix Card */}
            <Card variant="highlight" style={styles.planCard}>
              <View style={styles.planCardHeader}>
                <Text style={styles.planTargetCalVal}>
                  {targets.targetCalories}
                </Text>
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
                    {Math.round(targets.targetWaterMl / 1000 * 10) / 10}L
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
              fullWidth
              style={{ marginTop: Spacing.lg }}
            />
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  stepContainer: {
    alignItems: 'center',
  },
  brandBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  brandTitle: {
    color: Palette.textPrimary,
    fontSize: 36,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -1,
  },
  brandSubtitle: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
    letterSpacing: 1.2,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  welcomeDesc: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.body,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.lg,
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
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
    gap: Spacing.md,
  },
  goalOptionActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  goalIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    paddingVertical: Spacing.xl,
    marginTop: Spacing.md,
  },
  planCardHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  planTargetCalVal: {
    color: Palette.textPrimary,
    fontSize: 48,
    fontWeight: Typography.fontWeights.black,
  },
  planTargetCalLbl: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
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
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  planMacroLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  bmrSubRow: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  bmrSubText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
});
