import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LoggedFoodItem } from '../../types';
import { Palette } from '../../constants/colors';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';

interface FoodItemRowProps {
  item: LoggedFoodItem;
  onDelete: () => void;
}

export const FoodItemRow: React.FC<FoodItemRowProps> = ({ item, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.infoCol}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.serving}>
          {item.servings} × {item.servingUnit}
        </Text>
      </View>

      {/* Macros breakdown */}
      <View style={styles.macrosCol}>
        <Text style={styles.calories}>{item.calories} kcal</Text>
        <Text style={styles.macroPills}>
          <Text style={{ color: Palette.protein }}>P:{item.proteinG}g </Text>
          <Text style={{ color: Palette.carbs }}>C:{item.carbsG}g </Text>
          <Text style={{ color: Palette.fat }}>F:{item.fatG}g</Text>
        </Text>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        onPress={onDelete}
        style={styles.deleteBtn}
        activeOpacity={0.7}
      >
        <Ionicons name="trash-outline" size={16} color={Palette.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  infoCol: {
    flex: 1.6,
  },
  name: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  serving: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  macrosCol: {
    alignItems: 'flex-end',
    marginRight: Spacing.sm,
  },
  calories: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  macroPills: {
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
    fontWeight: Typography.fontWeights.semibold,
  },
  deleteBtn: {
    padding: 6,
  },
});
