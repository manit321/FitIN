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
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { WorkoutCard } from '../../components/workout/WorkoutCard';
import { ExerciseListItem } from '../../components/workout/ExerciseListItem';
import { EmptyState } from '../../components/ui/EmptyState';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatDate, formatDuration } from '../../utils/formatters';
import { RoutineCategory, MuscleGroup } from '../../types';

export default function WorkoutsScreen() {
  const router = useRouter();
  const {
    routines,
    exercises,
    completedWorkouts,
    startWorkout,
    deleteCompletedWorkout,
  } = useFitness();

  const [activeTab, setActiveTab] = useState<'programs' | 'exercises' | 'history'>('programs');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [exerciseSearch, setExerciseSearch] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('All');

  const categories = ['All', 'Push', 'Pull', 'Legs', 'Upper', 'Full Body', 'Custom'];
  const muscles = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Biceps', 'Triceps', 'Core', 'Cardio'];

  // Filter routines
  const filteredRoutines = routines.filter((r) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Custom') return r.isCustom;
    return r.category === selectedCategory;
  });

  // Filter exercises
  const filteredExercises = exercises.filter((e) => {
    const matchesSearch = e.name.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle =
      selectedMuscle === 'All' ||
      e.targetMuscle === selectedMuscle ||
      e.secondaryMuscles.includes(selectedMuscle as MuscleGroup);
    return matchesSearch && matchesMuscle;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <AppHeader
        subtitle="TRAIN HARD"
        title="Workouts"
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/workout/create')}
            style={styles.addRoutineBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color={Palette.textInverse} />
            <Text style={styles.addRoutineBtnText}>New Routine</Text>
          </TouchableOpacity>
        }
      />

      {/* Main Sub-tabs Switcher */}
      <View style={styles.tabSwitcherContainer}>
        <SegmentedControl
          options={[
            { label: 'Programs', value: 'programs' },
            { label: 'Exercises', value: 'exercises' },
            { label: 'History', value: 'history' },
          ]}
          selectedValue={activeTab}
          onSelect={(val) => setActiveTab(val)}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* VIEW 1: WORKOUT PROGRAMS */}
        {activeTab === 'programs' && (
          <View>
            {/* Category Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPills}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryPill,
                    selectedCategory === cat && styles.categoryPillActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedCategory === cat && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Routines List */}
            {filteredRoutines.length > 0 ? (
              filteredRoutines.map((routine) => (
                <WorkoutCard
                  key={routine.id}
                  routine={routine}
                  onPress={() => router.push(`/workout/${routine.id}`)}
                  onStart={() => {
                    startWorkout(routine);
                    router.push('/workout/active');
                  }}
                />
              ))
            ) : (
              <EmptyState
                icon="barbell-outline"
                title="No Routines Found"
                description="Create a custom workout program to get started."
                actionTitle="Create Routine"
                onAction={() => router.push('/workout/create')}
              />
            )}
          </View>
        )}

        {/* VIEW 2: EXERCISE LIBRARY */}
        {activeTab === 'exercises' && (
          <View>
            {/* Search Input */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Palette.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search 30+ exercises..."
                placeholderTextColor={Palette.textMuted}
                value={exerciseSearch}
                onChangeText={setExerciseSearch}
                clearButtonMode="while-editing"
              />
            </View>

            {/* Muscle Group Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryPills}
            >
              {muscles.map((muscle) => (
                <TouchableOpacity
                  key={muscle}
                  onPress={() => setSelectedMuscle(muscle)}
                  style={[
                    styles.categoryPill,
                    selectedMuscle === muscle && styles.categoryPillActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.categoryPillText,
                      selectedMuscle === muscle && styles.categoryPillTextActive,
                    ]}
                  >
                    {muscle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Exercise List */}
            {filteredExercises.length > 0 ? (
              filteredExercises.map((exercise) => (
                <ExerciseListItem
                  key={exercise.id}
                  exercise={exercise}
                  onPress={() => router.push(`/exercise/${exercise.id}`)}
                />
              ))
            ) : (
              <EmptyState
                icon="search-outline"
                title="No Exercises Match"
                description="Try a different search query or muscle filter."
              />
            )}
          </View>
        )}

        {/* VIEW 3: WORKOUT HISTORY */}
        {activeTab === 'history' && (
          <View>
            {completedWorkouts.length > 0 ? (
              completedWorkouts.map((workout) => (
                <Card key={workout.id} variant="default" style={styles.historyCard}>
                  <View style={styles.historyHeader}>
                    <View>
                      <Text style={styles.historyDate}>{formatDate(workout.date)}</Text>
                      <Text style={styles.historyTitle}>{workout.routineName}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => deleteCompletedWorkout(workout.id)}
                      style={styles.deleteHistoryBtn}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={16} color={Palette.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.historyStatsGrid}>
                    <View style={styles.historyStatItem}>
                      <Ionicons name="time-outline" size={16} color={Palette.cyan} />
                      <Text style={styles.historyStatVal}>
                        {formatDuration(workout.durationSeconds)}
                      </Text>
                    </View>
                    <View style={styles.historyStatItem}>
                      <Ionicons name="barbell-outline" size={16} color={Palette.primary} />
                      <Text style={styles.historyStatVal}>
                        {workout.totalVolumeKg.toLocaleString()} kg
                      </Text>
                    </View>
                    <View style={styles.historyStatItem}>
                      <Ionicons name="flame-outline" size={16} color={Palette.orange} />
                      <Text style={styles.historyStatVal}>
                        {workout.caloriesBurned} kcal
                      </Text>
                    </View>
                    <View style={styles.historyStatItem}>
                      <Ionicons name="layers-outline" size={16} color={Palette.purple} />
                      <Text style={styles.historyStatVal}>
                        {workout.totalSetsCompleted} sets
                      </Text>
                    </View>
                  </View>

                  {workout.personalRecordsBroken && workout.personalRecordsBroken.length > 0 && (
                    <View style={styles.prBanner}>
                      <Ionicons name="trophy" size={16} color={Palette.amber} />
                      <Text style={styles.prBannerText}>
                        PR: {workout.personalRecordsBroken[0].exerciseName} (
                        {workout.personalRecordsBroken[0].weightKg}kg ×{' '}
                        {workout.personalRecordsBroken[0].reps})
                      </Text>
                    </View>
                  )}
                </Card>
              ))
            ) : (
              <EmptyState
                icon="time-outline"
                title="No Workout History"
                description="Complete your first workout to start tracking history."
                actionTitle="Start Workout"
                onAction={() => setActiveTab('programs')}
              />
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
    paddingBottom: Spacing.xxxl,
  },
  addRoutineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 4,
  },
  addRoutineBtnText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  tabSwitcherContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  categoryPills: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
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
    fontWeight: Typography.fontWeights.semibold,
  },
  categoryPillTextActive: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.bold,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
  },
  historyCard: {
    marginBottom: Spacing.md,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  historyDate: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
    textTransform: 'uppercase',
  },
  historyTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    marginTop: 2,
  },
  deleteHistoryBtn: {
    padding: 6,
  },
  historyStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  historyStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  historyStatVal: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  prBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    marginTop: Spacing.sm,
    gap: 6,
  },
  prBannerText: {
    color: Palette.amber,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
});
