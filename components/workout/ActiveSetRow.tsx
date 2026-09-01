import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutSet } from '../../types';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface ActiveSetRowProps {
  set: WorkoutSet;
  index: number;
  weightUnit?: string;
  onUpdateWeight: (weight: number) => void;
  onUpdateReps: (reps: number) => void;
  onToggleComplete: () => void;
  onDeleteSet: () => void;
  canDelete?: boolean;
}

export const ActiveSetRow: React.FC<ActiveSetRowProps> = ({
  set,
  index,
  weightUnit = 'kg',
  onUpdateWeight,
  onUpdateReps,
  onToggleComplete,
  onDeleteSet,
  canDelete = true,
}) => {
  return (
    <View
      style={[
        styles.row,
        set.isCompleted && styles.rowCompleted,
      ]}
    >
      {/* Set Number */}
      <View style={styles.setCol}>
        <Text style={[styles.setNumber, set.isCompleted && styles.textCompleted]}>
          {index + 1}
        </Text>
      </View>

      {/* Previous Performance Hint */}
      <View style={styles.prevCol}>
        <Text style={styles.prevText}>
          {set.prevWeightKg !== undefined && set.prevReps !== undefined
            ? `${set.prevWeightKg} × ${set.prevReps}`
            : '—'}
        </Text>
      </View>

      {/* Weight Input */}
      <View style={styles.inputCol}>
        <TextInput
          style={[
            styles.input,
            set.isCompleted && styles.inputCompleted,
          ]}
          keyboardType="decimal-pad"
          defaultValue={set.weightKg ? String(set.weightKg) : ''}
          placeholder="0"
          placeholderTextColor={Palette.textMuted}
          onChangeText={(text) => {
            const val = parseFloat(text) || 0;
            onUpdateWeight(val);
          }}
          editable={!set.isCompleted}
          selectTextOnFocus
        />
        <Text style={styles.inputUnit}>{weightUnit}</Text>
      </View>

      {/* Reps Input */}
      <View style={styles.inputCol}>
        <TextInput
          style={[
            styles.input,
            set.isCompleted && styles.inputCompleted,
          ]}
          keyboardType="number-pad"
          defaultValue={set.reps ? String(set.reps) : ''}
          placeholder="0"
          placeholderTextColor={Palette.textMuted}
          onChangeText={(text) => {
            const val = parseInt(text, 10) || 0;
            onUpdateReps(val);
          }}
          editable={!set.isCompleted}
          selectTextOnFocus
        />
        <Text style={styles.inputUnit}>reps</Text>
      </View>

      {/* Complete Checkbox Button */}
      <TouchableOpacity
        onPress={onToggleComplete}
        style={[
          styles.checkBtn,
          set.isCompleted && styles.checkBtnCompleted,
        ]}
        activeOpacity={0.7}
      >
        <Ionicons
          name={set.isCompleted ? 'checkmark' : 'checkmark-outline'}
          size={20}
          color={set.isCompleted ? Palette.textInverse : Palette.textMuted}
        />
      </TouchableOpacity>

      {/* Delete Set */}
      {canDelete && !set.isCompleted && (
        <TouchableOpacity
          onPress={onDeleteSet}
          style={styles.deleteBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={16} color={Palette.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  rowCompleted: {
    backgroundColor: 'rgba(0, 245, 155, 0.08)',
    borderColor: 'rgba(0, 245, 155, 0.3)',
  },
  setCol: {
    width: 28,
    alignItems: 'center',
  },
  setNumber: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  textCompleted: {
    color: Palette.primary,
  },
  prevCol: {
    flex: 1.2,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  prevText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  inputCol: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    height: 38,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  input: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
    height: '100%',
  },
  inputCompleted: {
    color: Palette.primary,
  },
  inputUnit: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  checkBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    backgroundColor: Palette.bgInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  checkBtnCompleted: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 2,
  },
});
