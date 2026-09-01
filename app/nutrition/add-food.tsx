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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Spacing, Typography, BorderRadius } from '../../constants/theme';
import { MealCategory, FoodItem } from '../../types';

export default function AddFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ meal?: MealCategory; date?: string }>();
  const { foods, addLoggedFood, addCustomFood } = useFitness();

  const [selectedMeal, setSelectedMeal] = useState<MealCategory>(
    params.meal || 'lunch'
  );
  const [targetDate] = useState<string>(
    params.date || new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');

  // Custom food inputs
  const [customName, setCustomName] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [customServing, setCustomServing] = useState('100g');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customFiber, setCustomFiber] = useState('');

  const mealOptions: { label: string; value: MealCategory }[] = [
    { label: 'Breakfast', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Dinner', value: 'dinner' },
    { label: 'Snacks', value: 'snacks' },
  ];

  const filteredFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.brand && f.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLogSelected = async () => {
    if (!selectedFood) return;
    const servNum = parseFloat(servings) || 1;
    await addLoggedFood(selectedFood, selectedMeal, servNum, targetDate);
    router.back();
  };

  const handleSaveCustomFood = async () => {
    if (!customName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for the custom food.');
      return;
    }
    const cals = parseInt(customCalories, 10) || 0;
    const p = parseFloat(customProtein) || 0;
    const c = parseFloat(customCarbs) || 0;
    const f = parseFloat(customFat) || 0;
    const fib = parseFloat(customFiber) || 0;

    const newFood = await addCustomFood({
      name: customName.trim(),
      brand: customBrand.trim() || undefined,
      category: 'Custom',
      servingSize: customServing.trim() || '1 serving',
      servingUnit: 'serving',
      baseServingQty: 1,
      calories: cals,
      proteinG: p,
      carbsG: c,
      fatG: f,
      fiberG: fib,
    });

    await addLoggedFood(newFood, selectedMeal, 1, targetDate);
    router.back();
  };

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
        <Text style={styles.headerTitle}>Log Food</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* MEAL CATEGORY SELECTOR */}
      <View style={styles.mealSelectorContainer}>
        <SegmentedControl
          options={mealOptions}
          selectedValue={selectedMeal}
          onSelect={(val) => setSelectedMeal(val)}
        />
      </View>

      {/* CATALOG VS CUSTOM TAB */}
      <View style={styles.typeSwitcher}>
        <TouchableOpacity
          onPress={() => setActiveTab('catalog')}
          style={[styles.typeBtn, activeTab === 'catalog' && styles.typeBtnActive]}
        >
          <Text
            style={[
              styles.typeBtnText,
              activeTab === 'catalog' && styles.typeBtnTextActive,
            ]}
          >
            Search Food Database
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('custom')}
          style={[styles.typeBtn, activeTab === 'custom' && styles.typeBtnActive]}
        >
          <Text
            style={[
              styles.typeBtnText,
              activeTab === 'custom' && styles.typeBtnTextActive,
            ]}
          >
            Create Custom Food
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TAB 1: SEARCH DATABASE */}
        {activeTab === 'catalog' && (
          <View>
            <View style={styles.searchRow}>
              <Ionicons name="search" size={18} color={Palette.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search chicken, paneer, oats, whey..."
                placeholderTextColor={Palette.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* FOOD ITEMS LIST */}
            {filteredFoods.map((food) => {
              const isSelected = selectedFood?.id === food.id;
              return (
                <TouchableOpacity
                  key={food.id}
                  onPress={() => setSelectedFood(food)}
                  style={[
                    styles.foodCard,
                    isSelected && styles.foodCardSelected,
                  ]}
                  activeOpacity={0.8}
                >
                  <View style={styles.foodInfo}>
                    <Text style={styles.foodName}>{food.name}</Text>
                    <Text style={styles.foodBrand}>
                      {food.brand ? `${food.brand} • ` : ''}
                      {food.servingSize}
                    </Text>
                  </View>
                  <View style={styles.foodMacros}>
                    <Text style={styles.foodCals}>{food.calories} kcal</Text>
                    <Text style={styles.macroPills}>
                      <Text style={{ color: Palette.protein }}>P:{food.proteinG}g </Text>
                      <Text style={{ color: Palette.carbs }}>C:{food.carbsG}g </Text>
                      <Text style={{ color: Palette.fat }}>F:{food.fatG}g</Text>
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* TAB 2: CREATE CUSTOM FOOD */}
        {activeTab === 'custom' && (
          <View>
            <InputField
              label="Food Name"
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Grandma's Protein Smoothie"
            />
            <InputField
              label="Brand / Source (Optional)"
              value={customBrand}
              onChangeText={setCustomBrand}
              placeholder="e.g. Homemade"
            />
            <InputField
              label="Serving Size"
              value={customServing}
              onChangeText={setCustomServing}
              placeholder="e.g. 1 bowl (200g)"
            />

            <View style={styles.customMacrosGrid}>
              <InputField
                label="Calories (kcal)"
                value={customCalories}
                onChangeText={setCustomCalories}
                keyboardType="number-pad"
                containerStyle={{ flex: 1 }}
              />
              <InputField
                label="Protein (g)"
                value={customProtein}
                onChangeText={setCustomProtein}
                keyboardType="decimal-pad"
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View style={styles.customMacrosGrid}>
              <InputField
                label="Carbs (g)"
                value={customCarbs}
                onChangeText={setCustomCarbs}
                keyboardType="decimal-pad"
                containerStyle={{ flex: 1 }}
              />
              <InputField
                label="Fat (g)"
                value={customFat}
                onChangeText={setCustomFat}
                keyboardType="decimal-pad"
                containerStyle={{ flex: 1 }}
              />
            </View>

            <InputField
              label="Fiber (g) (Optional)"
              value={customFiber}
              onChangeText={setCustomFiber}
              keyboardType="decimal-pad"
            />

            <Button
              title="Save & Log Custom Food"
              onPress={handleSaveCustomFood}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}
      </ScrollView>

      {/* BOTTOM LOGGING BAR (WHEN FOOD SELECTED IN CATALOG) */}
      {activeTab === 'catalog' && selectedFood && (
        <View style={styles.bottomBar}>
          <View style={styles.servingsRow}>
            <Text style={styles.selectedFoodLabel} numberOfLines={1}>
              {selectedFood.name}
            </Text>
            <View style={styles.servingsInputWrapper}>
              <Text style={styles.servingsLabel}>Servings:</Text>
              <TextInput
                style={styles.servingsInput}
                keyboardType="decimal-pad"
                value={servings}
                onChangeText={setServings}
                selectTextOnFocus
              />
            </View>
          </View>

          <Button
            title={`Log Food (${Math.round(
              selectedFood.calories * (parseFloat(servings) || 1)
            )} kcal)`}
            onPress={handleLogSelected}
            variant="primary"
            size="lg"
            fullWidth
            icon={<Ionicons name="restaurant" size={18} color={Palette.textInverse} />}
          />
        </View>
      )}
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
  mealSelectorContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  typeSwitcher: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  typeBtnActive: {
    borderBottomColor: Palette.primary,
  },
  typeBtnText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  typeBtnTextActive: {
    color: Palette.textPrimary,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 120,
  },
  searchRow: {
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
  foodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xs,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  foodCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  foodInfo: {
    flex: 1.5,
  },
  foodName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  foodBrand: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  foodMacros: {
    alignItems: 'flex-end',
  },
  foodCals: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.heavy,
  },
  macroPills: {
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
    fontWeight: Typography.fontWeights.semibold,
  },
  customMacrosGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Palette.bgCard,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  servingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectedFoodLabel: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    flex: 1,
  },
  servingsInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  servingsLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  servingsInput: {
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    height: 36,
    width: 60,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
});
