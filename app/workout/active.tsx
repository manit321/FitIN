import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ActiveSetRow } from '../../components/workout/ActiveSetRow';
import { ModalWrapper } from '../../components/ui/ModalWrapper';
import { ExerciseListItem } from '../../components/workout/ExerciseListItem';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { formatClockTimer } from '../../utils/formatters';
import { Exercise } from '../../types';

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const {
    activeWorkout,
    exercises,
    updateActiveSet,
    toggleSetCompleted,
    addActiveSet,
    removeActiveSet,
    addActiveExercise,
    removeActiveExercise,
    finishActiveWorkout,
    cancelActiveWorkout,
  } = useFitness();

  const [currentExIdx, setCurrentExIdx] = useState(0);
  const [isAddExerciseModalVisible, setIsAddExerciseModalVisible] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [isFinishModalVisible, setIsFinishModalVisible] = useState(false);

  if (!activeWorkout || activeWorkout.exercises.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No active workout in progress.</Text>
          <Button
            title="Go Back"
            onPress={() => router.replace('/(tabs)/workouts')}
            variant="primary"
            style={{ marginTop: Spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  const currentExerciseItem = activeWorkout.exercises[currentExIdx] || activeWorkout.exercises[0];
  const totalExercises = activeWorkout.exercises.length;

  const totalSetsDone = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.isCompleted).length,
    0
  );
  const totalSetsAll = activeWorkout.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  const handleFinish = async () => {
    setIsFinishModalVisible(false);
    const completed = await finishActiveWorkout(workoutNotes);
    if (completed) {
      router.replace({
        pathname: '/workout/summary',
        params: {
          workoutId: completed.id,
          duration: completed.durationSeconds,
          volume: completed.totalVolumeKg,
          sets: completed.totalSetsCompleted,
          calories: completed.caloriesBurned,
          routineName: completed.routineName,
          prsCount: completed.personalRecordsBroken.length,
        },
      });
    } else {
      router.replace('/(tabs)/workouts');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Workout?',
      'Are you sure you want to cancel? Any uncompleted sets will not be saved.',
      [
        { text: 'Continue Workout', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            cancelActiveWorkout();
            router.replace('/(tabs)/workouts');
          },
        },
      ]
    );
  };

  const filteredCatalog = exercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* TOP ACTIVE WORKOUT BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.cancelBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={22} color={Palette.textMuted} />
        </TouchableOpacity>

        <View style={styles.timerCenter}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.timerText}>
            {formatClockTimer(activeWorkout.elapsedTimeSeconds)}
          </Text>
        </View>

        <Button
          title="Finish"
          onPress={() => setIsFinishModalVisible(true)}
          variant="primary"
          size="sm"
          style={styles.finishBtn}
        />
      </View>

      {/* WORKOUT TITLE & OVERALL PROGRESS */}
      <View style={styles.workoutMetaBar}>
        <View style={styles.metaLeft}>
          <Text style={styles.routineTitle} numberOfLines={1}>
            {activeWorkout.routineName}
          </Text>
          <Text style={styles.setsProgressText}>
            {totalSetsDone} / {totalSetsAll} sets completed
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setIsAddExerciseModalVisible(true)}
          style={styles.addExPill}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color={Palette.primary} />
          <Text style={styles.addExPillText}>Add Ex</Text>
        </TouchableOpacity>
      </View>

      {/* EXERCISE STEPPER CAROUSEL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepperScroll}
      >
        {activeWorkout.exercises.map((ae, idx) => {
          const isCurrent = idx === currentExIdx;
          const completedCount = ae.sets.filter((s) => s.isCompleted).length;
          const isDone = completedCount === ae.sets.length && ae.sets.length > 0;

          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setCurrentExIdx(idx)}
              style={[
                styles.stepperItem,
                isCurrent && styles.stepperItemActive,
                isDone && styles.stepperItemDone,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.stepperText,
                  isCurrent && styles.stepperTextActive,
                ]}
              >
                {idx + 1}. {ae.exercise.name}
              </Text>
              {isDone && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color={Palette.primary}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* CURRENT EXERCISE WORKING CARD */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Card variant="elevated" style={styles.exerciseWorkingCard}>
          <View style={styles.exCardHeader}>
            <View style={styles.exInfoColumn}>
              <Text style={styles.currentExName}>
                {currentExerciseItem.exercise.name}
              </Text>
              <View style={styles.exBadgeRow}>
                <Badge
                  label={currentExerciseItem.exercise.targetMuscle}
                  variant="cyan"
                  size="sm"
                />
                <Badge
                  label={currentExerciseItem.exercise.equipment}
                  variant="muted"
                  size="sm"
                />
                {currentExerciseItem.targetRestSeconds && (
                  <Badge
                    label={`${currentExerciseItem.targetRestSeconds}s Rest`}
                    variant="orange"
                    size="sm"
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push(`/exercise/${currentExerciseItem.exercise.id}`)}
              style={styles.infoBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Palette.primary}
              />
            </TouchableOpacity>
          </View>

          {/* SETS TABLE HEADER */}
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.thText, { width: 28 }]}>SET</Text>
            <Text style={[styles.thText, { flex: 1.2, textAlign: 'center' }]}>PREV</Text>
            <Text style={[styles.thText, { flex: 1.4, textAlign: 'center' }]}>KG</Text>
            <Text style={[styles.thText, { flex: 1.4, textAlign: 'center' }]}>REPS</Text>
            <Text style={[styles.thText, { width: 38, textAlign: 'center' }]}>✓</Text>
          </View>

          {/* SET ROWS */}
          {currentExerciseItem.sets.map((set, sIdx) => (
            <ActiveSetRow
              key={set.id}
              set={set}
              index={sIdx}
              onUpdateWeight={(w) =>
                updateActiveSet(currentExIdx, sIdx, { weightKg: w })
              }
              onUpdateReps={(r) =>
                updateActiveSet(currentExIdx, sIdx, { reps: r })
              }
              onToggleComplete={() => toggleSetCompleted(currentExIdx, sIdx)}
              onDeleteSet={() => removeActiveSet(currentExIdx, sIdx)}
              canDelete={currentExerciseItem.sets.length > 1}
            />
          ))}

          {/* SET ACTIONS */}
          <View style={styles.setActionsRow}>
            <Button
              title="+ Add Set"
              onPress={() => addActiveSet(currentExIdx)}
              variant="outline"
              size="sm"
              style={styles.addSetBtn}
            />
            {totalExercises > 1 && (
              <Button
                title="Remove Exercise"
                onPress={() => {
                  removeActiveExercise(currentExIdx);
                  setCurrentExIdx((prev) => Math.max(0, prev - 1));
                }}
                variant="danger"
                size="sm"
                style={styles.removeExBtn}
              />
            )}
          </View>
        </Card>

        {/* NAVIGATION PREV / NEXT EXERCISE */}
        <View style={styles.exNavRow}>
          <Button
            title="Previous"
            onPress={() => setCurrentExIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentExIdx === 0}
            variant="secondary"
            icon={<Ionicons name="chevron-back" size={18} color={Palette.textPrimary} />}
            style={styles.exNavBtn}
          />
          <Button
            title={currentExIdx === totalExercises - 1 ? 'Finish Workout' : 'Next Exercise'}
            onPress={() => {
              if (currentExIdx === totalExercises - 1) {
                setIsFinishModalVisible(true);
              } else {
                setCurrentExIdx((prev) => Math.min(totalExercises - 1, prev + 1));
              }
            }}
            variant="primary"
            iconPosition="right"
            icon={
              <Ionicons
                name={currentExIdx === totalExercises - 1 ? 'checkmark' : 'chevron-forward'}
                size={18}
                color={Palette.textInverse}
              />
            }
            style={styles.exNavBtn}
          />
        </View>
      </ScrollView>

      {/* ADD EXERCISE MODAL */}
      <ModalWrapper
        visible={isAddExerciseModalVisible}
        onClose={() => setIsAddExerciseModalVisible(false)}
        title="Add Exercise"
        subtitle="Select from exercise library"
        scrollable
      >
        <TextInput
          style={styles.modalSearchInput}
          placeholder="Search exercises..."
          placeholderTextColor={Palette.textMuted}
          value={exerciseSearch}
          onChangeText={setExerciseSearch}
        />
        {filteredCatalog.map((ex) => (
          <ExerciseListItem
            key={ex.id}
            exercise={ex}
            onPress={() => {
              addActiveExercise(ex);
              setIsAddExerciseModalVisible(false);
              setCurrentExIdx(activeWorkout.exercises.length);
            }}
          />
        ))}
      </ModalWrapper>

      {/* FINISH WORKOUT CONFIRMATION MODAL */}
      <ModalWrapper
        visible={isFinishModalVisible}
        onClose={() => setIsFinishModalVisible(false)}
        title="Complete Workout 🎉"
        subtitle={`Session time: ${formatClockTimer(activeWorkout.elapsedTimeSeconds)}`}
      >
        <Text style={styles.modalNoteLabel}>Workout Notes (Optional)</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="How did today's session feel? Felt strong on bench press..."
          placeholderTextColor={Palette.textMuted}
          multiline
          numberOfLines={3}
          value={workoutNotes}
          onChangeText={setWorkoutNotes}
        />

        <View style={styles.modalStatsPreview}>
          <View style={styles.modalStatCol}>
            <Text style={styles.modalStatVal}>{totalSetsDone}</Text>
            <Text style={styles.modalStatLbl}>Sets Completed</Text>
          </View>
          <View style={styles.modalStatCol}>
            <Text style={styles.modalStatVal}>
              {Math.round(activeWorkout.elapsedTimeSeconds / 60)}m
            </Text>
            <Text style={styles.modalStatLbl}>Duration</Text>
          </View>
        </View>

        <Button
          title="Save & View Summary"
          onPress={handleFinish}
          variant="primary"
          fullWidth
          size="lg"
          icon={<Ionicons name="checkmark-done" size={22} color={Palette.textInverse} />}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    backgroundColor: Palette.bgCard,
  },
  cancelBtn: {
    padding: Spacing.xs,
  },
  timerCenter: {
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.rose,
  },
  liveText: {
    color: Palette.rose,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.8,
  },
  timerText: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: 0.5,
  },
  finishBtn: {
    minWidth: 80,
  },
  workoutMetaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Palette.bgCardElevated,
  },
  metaLeft: {
    flex: 1,
  },
  routineTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  setsProgressText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
    marginTop: 2,
  },
  addExPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    gap: 4,
  },
  addExPillText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  stepperScroll: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  stepperItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Palette.bgCard,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  stepperItemActive: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  stepperItemDone: {
    borderColor: 'rgba(0, 245, 155, 0.4)',
  },
  stepperText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  stepperTextActive: {
    color: Palette.textPrimary,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  exerciseWorkingCard: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  exCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  exInfoColumn: {
    flex: 1,
  },
  currentExName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.black,
    marginBottom: 6,
  },
  exBadgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  infoBtn: {
    padding: Spacing.xs,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
    marginBottom: Spacing.sm,
  },
  thText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 0.5,
  },
  setActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  addSetBtn: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  removeExBtn: {
    flex: 0.8,
  },
  exNavRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  exNavBtn: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.body,
  },
  modalSearchInput: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Palette.textPrimary,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.md,
  },
  modalNoteLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  notesInput: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    color: Palette.textPrimary,
    height: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.md,
  },
  modalStatsPreview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalStatCol: {
    alignItems: 'center',
  },
  modalStatVal: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.heavy,
  },
  modalStatLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
});
