import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { AppHeader } from '../../components/ui/AppHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { WorkoutCard } from '../../components/workout/WorkoutCard';
import { ExerciseListItem } from '../../components/workout/ExerciseListItem';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { RoutineCategory, MuscleGroup } from '../../types';
import { formatDate } from '../../utils/formatters';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { routines, exercises, completedWorkouts, startWorkout } = useFitness();

  const [activeTab, setActiveTab] = useState<'programs' | 'exercises' | 'history'>('programs');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');

  const categories: string[] = [
    'All',
    'Push',
    'Pull',
    'Legs',
    'Upper',
    'Full Body',
    'Cardio',
    'Custom',
  ];

  const muscleGroups: string[] = [
    'All',
    'Chest',
    'Back',
    'Legs',
    'Shoulders',
    'Biceps',
    'Triceps',
    'Core',
  ];

  const filteredRoutines = routines.filter((r) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Custom') return r.isCustom;
    return r.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle =
      selectedMuscle === 'All' ||
      ex.targetMuscle.toLowerCase() === selectedMuscle.toLowerCase() ||
      ex.secondaryMuscles.some((m) => m.toLowerCase() === selectedMuscle.toLowerCase());
    return matchesSearch && matchesMuscle;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <AppHeader
          title="Workouts"
          subtitle="TRAINING & EXERCISES"
          rightAction={
            <TouchableOpacity
              onPress={() => router.push('/workout/create')}
              style={styles.createBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color={Palette.textInverse} />
              <Text style={styles.createBtnText}>Build</Text>
            </TouchableOpacity>
          }
        />

        {/* View Switcher */}
        <View style={styles.tabSwitcherWrapper}>
          <SegmentedControl
            options={[
              { label: 'Programs', value: 'programs' },
              { label: `Exercises (${exercises.length})`, value: 'exercises' },
              { label: 'History', value: 'history' },
            ]}
            selectedValue={activeTab}
            onSelect={(val) => setActiveTab(val)}
          />
        </View>

        {/* VIEW 1: PROGRAMS */}
        {activeTab === 'programs' && (
          <View>
            {/* Category Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScroll}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.pillBtn,
                    selectedCategory === cat && styles.pillBtnActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selectedCategory === cat && styles.pillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Routines Grid */}
            {filteredRoutines.map((routine) => (
              <WorkoutCard
                key={routine.id}
                routine={routine}
                onPress={() => router.push(`/workout/${routine.id}`)}
                onStart={() => {
                  startWorkout(routine);
                  router.push('/workout/active');
                }}
              />
            ))}

            {filteredRoutines.length === 0 && (
              <Card variant="default" style={styles.emptyStateCard}>
                <Text style={styles.emptyStateTitle}>No routines found</Text>
                <Text style={styles.emptyStateSub}>
                  Create your first custom workout routine.
                </Text>
                <Button
                  title="Build Custom Routine"
                  onPress={() => router.push('/workout/create')}
                  variant="primary"
                  size="sm"
                  style={{ marginTop: Spacing.sm }}
                />
              </Card>
            )}
          </View>
        )}

        {/* VIEW 2: EXERCISES */}
        {activeTab === 'exercises' && (
          <View>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Palette.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search exercises by name..."
                placeholderTextColor={Palette.textMuted}
                value={exerciseSearch}
                onChangeText={setExerciseSearch}
              />
              {exerciseSearch.length > 0 && (
                <TouchableOpacity onPress={() => setExerciseSearch('')}>
                  <Ionicons name="close-circle" size={16} color={Palette.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Muscle Group Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsScroll}
            >
              {muscleGroups.map((muscle) => (
                <TouchableOpacity
                  key={muscle}
                  onPress={() => setSelectedMuscle(muscle)}
                  style={[
                    styles.pillBtn,
                    selectedMuscle === muscle && styles.pillBtnActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selectedMuscle === muscle && styles.pillTextActive,
                    ]}
                  >
                    {muscle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Exercise List */}
            {filteredExercises.map((ex) => (
              <ExerciseListItem
                key={ex.id}
                exercise={ex}
                onPress={() => router.push(`/exercise/${ex.id}`)}
              />
            ))}
          </View>
        )}

        {/* VIEW 3: WORKOUT HISTORY */}
        {activeTab === 'history' && (
          <View>
            {completedWorkouts.map((workout) => (
              <Card key={workout.id} variant="default" style={styles.historyCard}>
                <View style={styles.historyTopRow}>
                  <View>
                    <Text style={styles.historyName}>{workout.routineName}</Text>
                    <Text style={styles.historyDate}>{formatDate(workout.date)}</Text>
                  </View>
                  <Badge
                    label={`${Math.round(workout.durationSeconds / 60)} min`}
                    variant="primary"
                    size="sm"
                  />
                </View>

                <View style={styles.historyStatsRow}>
                  <View style={styles.historyStatBox}>
                    <Text style={styles.historyStatVal}>{workout.totalVolumeKg} kg</Text>
                    <Text style={styles.historyStatLbl}>Volume</Text>
                  </View>
                  <View style={styles.historyStatBox}>
                    <Text style={styles.historyStatVal}>{workout.totalSetsCompleted}</Text>
                    <Text style={styles.historyStatLbl}>Sets</Text>
                  </View>
                  <View style={styles.historyStatBox}>
                    <Text style={styles.historyStatVal}>{workout.caloriesBurned} kcal</Text>
                    <Text style={styles.historyStatLbl}>Burned</Text>
                  </View>
                </View>
              </Card>
            ))}

            {completedWorkouts.length === 0 && (
              <Card variant="default" style={styles.emptyStateCard}>
                <Ionicons name="barbell-outline" size={32} color={Palette.textMuted} />
                <Text style={styles.emptyStateTitle}>No workout history yet</Text>
                <Text style={styles.emptyStateSub}>
                  Complete your first workout to see your lifting logs here.
                </Text>
              </Card>
            )}
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxxl,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  createBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
  },
  tabSwitcherWrapper: {
    marginBottom: Spacing.md,
  },
  pillsScroll: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  pillBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.bgCardElevated,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  pillBtnActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  pillText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  pillTextActive: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.heavy,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
  },
  emptyStateCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: 4,
  },
  emptyStateTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  emptyStateSub: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    textAlign: 'center',
  },
  historyCard: {
    marginBottom: Spacing.sm,
    padding: Spacing.md,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  historyName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  historyDate: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  historyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
  },
  historyStatBox: {
    alignItems: 'center',
  },
  historyStatVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  historyStatLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    marginTop: 2,
  },
});
