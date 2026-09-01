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
import { Badge } from '../../components/ui/Badge';
import { ModalWrapper } from '../../components/ui/ModalWrapper';
import { ExerciseListItem } from '../../components/workout/ExerciseListItem';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { RoutineCategory, Difficulty, RoutineExercise, Exercise } from '../../types';

export default function CreateRoutineScreen() {
  const router = useRouter();
  const { exercises, addOrUpdateRoutine } = useFitness();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RoutineCategory>('Custom');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');
  const [estimatedMinutes, setEstimatedMinutes] = useState('50');
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories: RoutineCategory[] = [
    'Push',
    'Pull',
    'Legs',
    'Upper',
    'Lower',
    'Full Body',
    'Cardio',
    'Custom',
  ];

  const difficulties: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

  const handleAddExerciseToRoutine = (ex: Exercise) => {
    const newRe: RoutineExercise = {
      exerciseId: ex.id,
      targetSets: 3,
      targetRepsMin: 8,
      targetRepsMax: 12,
      targetWeightKg: 20,
      restSeconds: 90,
    };
    setSelectedExercises([...selectedExercises, newRe]);
    setIsAddExModalOpen(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, idx) => idx !== index));
  };

  const handleUpdateExerciseParam = (
    index: number,
    field: keyof RoutineExercise,
    value: any
  ) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for this workout routine.');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert(
        'Missing Exercises',
        'Please add at least 1 exercise to this workout routine.'
      );
      return;
    }

    const newRoutine = {
      id: `routine-custom-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom user routine',
      category,
      difficulty,
      estimatedMinutes: parseInt(estimatedMinutes, 10) || 45,
      exercises: selectedExercises,
      tags: [category, difficulty],
      isCustom: true,
      timesCompleted: 0,
    };

    await addOrUpdateRoutine(newRoutine);
    router.back();
  };

  const filteredCatalog = exercises.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Text style={styles.headerTitle}>Create Routine</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={styles.saveBtn}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ROUTINE BASICS */}
        <InputField
          label="Routine Name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Chest & Tricep Hypertrophy"
        />

        <InputField
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. High volume pressing workout for chest pump"
          multiline
        />

        {/* CATEGORY SELECTOR */}
        <Text style={styles.sectionLabel}>Routine Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillsRow}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              style={[
                styles.categoryPill,
                category === cat && styles.categoryPillActive,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  category === cat && styles.categoryPillTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* DIFFICULTY & DURATION */}
        <View style={styles.rowTwo}>
          <InputField
            label="Duration"
            value={estimatedMinutes}
            onChangeText={setEstimatedMinutes}
            keyboardType="number-pad"
            unitSuffix="min"
            containerStyle={{ flex: 1 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.sectionLabel}>Difficulty</Text>
            <View style={styles.diffSelector}>
              {difficulties.map((diff) => (
                <TouchableOpacity
                  key={diff}
                  onPress={() => setDifficulty(diff)}
                  style={[
                    styles.diffBtn,
                    difficulty === diff && styles.diffBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.diffBtnText,
                      difficulty === diff && styles.diffBtnTextActive,
                    ]}
                  >
                    {diff.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* EXERCISES IN ROUTINE */}
        <View style={styles.exSectionHeader}>
          <Text style={styles.sectionTitle}>
            Exercises ({selectedExercises.length})
          </Text>
          <TouchableOpacity
            onPress={() => setIsAddExModalOpen(true)}
            style={styles.addExBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color={Palette.primary} />
            <Text style={styles.addExBtnText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        {selectedExercises.map((re, idx) => {
          const ex = exercises.find((e) => e.id === re.exerciseId);
          return (
            <Card key={idx} variant="default" style={styles.exCard}>
              <View style={styles.exHeader}>
                <Text style={styles.exCardName}>
                  {idx + 1}. {ex ? ex.name : 'Exercise'}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveExercise(idx)}
                  style={styles.deleteExBtn}
                >
                  <Ionicons name="trash-outline" size={16} color={Palette.danger} />
                </TouchableOpacity>
              </View>

              {/* Set & Rep Inputs */}
              <View style={styles.paramsRow}>
                <View style={styles.paramBox}>
                  <Text style={styles.paramLabel}>Sets</Text>
                  <TextInput
                    style={styles.paramInput}
                    keyboardType="number-pad"
                    defaultValue={String(re.targetSets)}
                    onChangeText={(t) =>
                      handleUpdateExerciseParam(idx, 'targetSets', parseInt(t, 10) || 1)
                    }
                  />
                </View>

                <View style={styles.paramBox}>
                  <Text style={styles.paramLabel}>Reps Min</Text>
                  <TextInput
                    style={styles.paramInput}
                    keyboardType="number-pad"
                    defaultValue={String(re.targetRepsMin)}
                    onChangeText={(t) =>
                      handleUpdateExerciseParam(idx, 'targetRepsMin', parseInt(t, 10) || 1)
                    }
                  />
                </View>

                <View style={styles.paramBox}>
                  <Text style={styles.paramLabel}>Reps Max</Text>
                  <TextInput
                    style={styles.paramInput}
                    keyboardType="number-pad"
                    defaultValue={String(re.targetRepsMax)}
                    onChangeText={(t) =>
                      handleUpdateExerciseParam(idx, 'targetRepsMax', parseInt(t, 10) || 1)
                    }
                  />
                </View>

                <View style={styles.paramBox}>
                  <Text style={styles.paramLabel}>Rest (s)</Text>
                  <TextInput
                    style={styles.paramInput}
                    keyboardType="number-pad"
                    defaultValue={String(re.restSeconds)}
                    onChangeText={(t) =>
                      handleUpdateExerciseParam(idx, 'restSeconds', parseInt(t, 10) || 60)
                    }
                  />
                </View>
              </View>
            </Card>
          );
        })}

        {selectedExercises.length === 0 && (
          <TouchableOpacity
            onPress={() => setIsAddExModalOpen(true)}
            style={styles.emptyAddBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={32} color={Palette.primary} />
            <Text style={styles.emptyAddText}>Tap to add exercises</Text>
          </TouchableOpacity>
        )}

        <Button
          title="Save Workout Routine"
          onPress={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          style={{ marginTop: Spacing.xl }}
        />
      </ScrollView>

      {/* SELECT EXERCISE MODAL */}
      <ModalWrapper
        visible={isAddExModalOpen}
        onClose={() => setIsAddExModalOpen(false)}
        title="Select Exercise"
        subtitle="Choose an exercise for this routine"
        scrollable
      >
        <TextInput
          style={styles.modalSearch}
          placeholder="Search exercises..."
          placeholderTextColor={Palette.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredCatalog.map((ex) => (
          <ExerciseListItem
            key={ex.id}
            exercise={ex}
            onPress={() => handleAddExerciseToRoutine(ex)}
          />
        ))}
      </ModalWrapper>
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
  saveBtn: {
    padding: Spacing.xs,
  },
  saveText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  sectionLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.bgCardElevated,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  categoryPillActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  categoryPillText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  categoryPillTextActive: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.bold,
  },
  rowTwo: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  diffSelector: {
    flexDirection: 'row',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    height: 48,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    padding: 3,
  },
  diffBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  diffBtnActive: {
    backgroundColor: Palette.primary,
  },
  diffBtnText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  diffBtnTextActive: {
    color: Palette.textInverse,
  },
  exSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.bold,
  },
  addExBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  addExBtnText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  exCard: {
    marginBottom: Spacing.sm,
  },
  exHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  exCardName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    flex: 1,
  },
  deleteExBtn: {
    padding: Spacing.xs,
  },
  paramsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  paramBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  paramLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
  },
  paramInput: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
    height: 28,
  },
  emptyAddBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
    borderStyle: 'dashed',
  },
  emptyAddText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginTop: Spacing.xs,
  },
  modalSearch: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.md,
  },
});
