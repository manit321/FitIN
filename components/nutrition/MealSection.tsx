import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealCategory, LoggedFoodItem } from '../../types';
import { Palette } from '../../constants/colors';
import { Card } from '../ui/Card';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { FoodItemRow } from './FoodItemRow';

interface MealSectionProps {
  category: MealCategory;
  items: LoggedFoodItem[];
  onAddFood: () => void;
  onDeleteItem: (loggedId: string) => void;
}

export const MealSection: React.FC<MealSectionProps> = ({
  category,
  items,
  onAddFood,
  onDeleteItem,
}) => {
  const getCategoryMeta = () => {
    switch (category) {
      case 'breakfast':
        return { title: 'Breakfast', icon: 'sunny-outline', color: Palette.amber };
      case 'lunch':
        return { title: 'Lunch', icon: 'restaurant-outline', color: Palette.primary };
      case 'dinner':
        return { title: 'Dinner', icon: 'moon-outline', color: Palette.purple };
      case 'snacks':
      default:
        return { title: 'Snacks & Extras', icon: 'cafe-outline', color: Palette.cyan };
    }
  };

  const meta = getCategoryMeta();

  const totalCalories = items.reduce((acc, i) => acc + i.calories, 0);
  const totalProtein = Math.round(items.reduce((acc, i) => acc + i.proteinG, 0) * 10) / 10;
  const totalCarbs = Math.round(items.reduce((acc, i) => acc + i.carbsG, 0) * 10) / 10;
  const totalFat = Math.round(items.reduce((acc, i) => acc + i.fatG, 0) * 10) / 10;

  return (
    <Card variant="default" style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconCircle, { backgroundColor: `${meta.color}20` }]}>
            <Ionicons name={meta.icon as any} size={18} color={meta.color} />
          </View>
          <View>
            <Text style={styles.categoryTitle}>{meta.title}</Text>
            <Text style={styles.macroSubtitle}>
              {totalProtein}g P • {totalCarbs}g C • {totalFat}g F
            </Text>
          </View>
        </View>

        <View style={styles.calorieBadge}>
          <Text style={styles.calorieText}>{totalCalories}</Text>
          <Text style={styles.kcalLabel}>kcal</Text>
        </View>
      </View>

      {/* Items list */}
      {items.length > 0 ? (
        <View style={styles.itemsList}>
          {items.map((item) => (
            <FoodItemRow
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No foods logged yet</Text>
        </View>
      )}

      {/* Add Food Button */}
      <TouchableOpacity
        onPress={onAddFood}
        style={styles.addBtn}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={18} color={Palette.primary} />
        <Text style={styles.addBtnText}>Add Food</Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  macroSubtitle: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  calorieBadge: {
    alignItems: 'flex-end',
  },
  calorieText: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  kcalLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  itemsList: {
    marginTop: Spacing.xs,
  },
  emptyState: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  emptyText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    marginTop: Spacing.xs,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    borderStyle: 'dashed',
  },
  addBtnText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
});
