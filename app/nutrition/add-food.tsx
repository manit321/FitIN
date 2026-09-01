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
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { MealCategory, FoodItem } from '../../types';
import { FoodService } from '../../services/foodService';

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
  const [activeTab, setActiveTab] = useState<'catalog' | 'global' | 'custom'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');

  // Global search & barcode states
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [globalResults, setGlobalResults] = useState<FoodItem[]>([]);

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

  const filteredLocalFoods = foods.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.brand && f.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearchGlobal = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingGlobal(true);
    const results = await FoodService.searchOpenFoodFacts(searchQuery);
    setGlobalResults(results);
    setIsSearchingGlobal(false);
  };

  const handleBarcodeLookup = async () => {
    if (!barcodeInput.trim()) return;
    setIsSearchingGlobal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const product = await FoodService.lookupBarcode(barcodeInput);
    setIsSearchingGlobal(false);

    if (product) {
      setSelectedFood(product);
      setServings('1');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Alert.alert('Barcode Not Found', 'No product found for this barcode in Open Food Facts.');
    }
  };

  const handleLogSelected = async () => {
    if (!selectedFood) return;
    const servNum = parseFloat(servings) || 1;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addLoggedFood(newFood, selectedMeal, 1, targetDate);
    router.back();
  };

  const servNum = parseFloat(servings) || 1;
  const previewCals = selectedFood ? Math.round(selectedFood.calories * servNum) : 0;
  const previewP = selectedFood ? Math.round(selectedFood.proteinG * servNum * 10) / 10 : 0;
  const previewC = selectedFood ? Math.round(selectedFood.carbsG * servNum * 10) / 10 : 0;
  const previewF = selectedFood ? Math.round(selectedFood.fatG * servNum * 10) / 10 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Meal Category Picker */}
        <View style={styles.mealSelectorRow}>
          {mealOptions.map((m) => (
            <TouchableOpacity
              key={m.value}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedMeal(m.value);
              }}
              style={[
                styles.mealOptionBtn,
                selectedMeal === m.value && styles.mealOptionActive,
              ]}
            >
              <Text
                style={[
                  styles.mealOptionText,
                  selectedMeal === m.value && styles.mealOptionTextActive,
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Segmented Control */}
        <SegmentedControl<'catalog' | 'global' | 'custom'>
          options={[
            { label: 'Verified Database', value: 'catalog' },
            { label: 'Global / Barcode', value: 'global' },
            { label: '+ Custom Food', value: 'custom' },
          ]}
          selectedValue={activeTab}
          onSelect={(val) => setActiveTab(val)}
          style={styles.segmentedControl}
        />

        {/* TAB 1: VERIFIED LOCAL CATALOG */}
        {activeTab === 'catalog' && (
          <View>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Palette.textMuted} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search chicken, oats, whey, paneer..."
                placeholderTextColor={Palette.textMuted}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.foodList}>
              {filteredLocalFoods.map((item) => {
                const isSelected = selectedFood?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFood(item);
                    }}
                    style={[
                      styles.foodItemCard,
                      isSelected && styles.foodItemCardSelected,
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.foodItemLeft}>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                      <Text style={styles.foodItemBrand}>
                        {item.brand ? `${item.brand} • ` : ''}
                        {item.servingSize}
                      </Text>
                      <Text style={styles.foodItemMacros}>
                        {item.proteinG}g P • {item.carbsG}g C • {item.fatG}g F
                      </Text>
                    </View>
                    <View style={styles.foodItemRight}>
                      <Text style={styles.foodItemCals}>{item.calories}</Text>
                      <Text style={styles.foodItemKcalLabel}>kcal</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 2: GLOBAL OPEN FOOD FACTS & BARCODE */}
        {activeTab === 'global' && (
          <View>
            {/* Barcode Search Box */}
            <Card variant="default" style={styles.barcodeCard}>
              <View style={styles.barcodeHeader}>
                <Ionicons name="barcode-outline" size={20} color={Palette.primary} />
                <Text style={styles.barcodeTitle}>Enter Product Barcode</Text>
              </View>
              <View style={styles.barcodeInputRow}>
                <TextInput
                  style={styles.barcodeInput}
                  value={barcodeInput}
                  onChangeText={setBarcodeInput}
                  placeholder="e.g. 737628064502"
                  placeholderTextColor={Palette.textMuted}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  onPress={handleBarcodeLookup}
                  style={styles.barcodeLookupBtn}
                  disabled={isSearchingGlobal || !barcodeInput.trim()}
                >
                  <Ionicons name="arrow-forward" size={18} color={Palette.textInverse} />
                </TouchableOpacity>
              </View>
            </Card>

            {/* Global Search Bar */}
            <View style={[styles.searchBar, { marginTop: Spacing.sm }]}>
              <Ionicons name="globe-outline" size={18} color={Palette.cyan} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search worldwide Open Food Facts..."
                placeholderTextColor={Palette.textMuted}
                onSubmitEditing={handleSearchGlobal}
                returnKeyType="search"
              />
              <TouchableOpacity
                onPress={handleSearchGlobal}
                style={styles.searchSubmitBtn}
              >
                <Text style={styles.searchSubmitText}>Search</Text>
              </TouchableOpacity>
            </View>

            {isSearchingGlobal && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Palette.primary} />
                <Text style={styles.loadingText}>Querying Open Food Facts database...</Text>
              </View>
            )}

            <View style={styles.foodList}>
              {globalResults.map((item) => {
                const isSelected = selectedFood?.id === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFood(item);
                    }}
                    style={[
                      styles.foodItemCard,
                      isSelected && styles.foodItemCardSelected,
                    ]}
                    activeOpacity={0.8}
                  >
                    <View style={styles.foodItemLeft}>
                      <Text style={styles.foodItemName}>{item.name}</Text>
                      <Text style={styles.foodItemBrand}>
                        {item.brand ? `${item.brand} • ` : ''}
                        {item.servingSize}
                      </Text>
                      <Text style={styles.foodItemMacros}>
                        {item.proteinG}g P • {item.carbsG}g C • {item.fatG}g F
                      </Text>
                    </View>
                    <View style={styles.foodItemRight}>
                      <Text style={styles.foodItemCals}>{item.calories}</Text>
                      <Text style={styles.foodItemKcalLabel}>kcal</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* TAB 3: CUSTOM FOOD CREATOR */}
        {activeTab === 'custom' && (
          <View style={styles.customForm}>
            <InputField
              label="Food / Meal Name *"
              value={customName}
              onChangeText={setCustomName}
              placeholder="e.g. Homemade Protein Pancakes"
            />
            <InputField
              label="Brand / Restaurant (Optional)"
              value={customBrand}
              onChangeText={setCustomBrand}
              placeholder="e.g. FitMeals"
            />
            <InputField
              label="Serving Size (e.g. 1 bowl, 200g)"
              value={customServing}
              onChangeText={setCustomServing}
              placeholder="100g"
            />

            <View style={styles.macroInputsGrid}>
              <InputField
                label="Calories (kcal) *"
                value={customCalories}
                onChangeText={setCustomCalories}
                keyboardType="number-pad"
                placeholder="250"
                containerStyle={{ flex: 1 }}
              />
              <InputField
                label="Protein (g) *"
                value={customProtein}
                onChangeText={setCustomProtein}
                keyboardType="decimal-pad"
                placeholder="25"
                containerStyle={{ flex: 1 }}
              />
            </View>

            <View style={styles.macroInputsGrid}>
              <InputField
                label="Carbs (g)"
                value={customCarbs}
                onChangeText={setCustomCarbs}
                keyboardType="decimal-pad"
                placeholder="30"
                containerStyle={{ flex: 1 }}
              />
              <InputField
                label="Fat (g)"
                value={customFat}
                onChangeText={setCustomFat}
                keyboardType="decimal-pad"
                placeholder="5"
                containerStyle={{ flex: 1 }}
              />
              <InputField
                label="Fiber (g)"
                value={customFiber}
                onChangeText={setCustomFiber}
                keyboardType="decimal-pad"
                placeholder="4"
                containerStyle={{ flex: 1 }}
              />
            </View>

            <Button
              title="Save & Log Food"
              onPress={handleSaveCustomFood}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.md }}
            />
          </View>
        )}

        {/* SELECTED FOOD PREVIEW & LOG BUTTON */}
        {selectedFood && activeTab !== 'custom' && (
          <Card variant="highlight" style={styles.previewCard}>
            <Text style={styles.previewTitle}>Selected: {selectedFood.name}</Text>
            <View style={styles.servingAdjustRow}>
              <Text style={styles.servingLabel}>Servings multiplier:</Text>
              <TextInput
                style={styles.servingInput}
                value={servings}
                onChangeText={setServings}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
            </View>

            <View style={styles.previewMacroRow}>
              <View style={styles.previewMacroItem}>
                <Text style={styles.previewMacroVal}>{previewCals}</Text>
                <Text style={styles.previewMacroLbl}>kcal</Text>
              </View>
              <View style={styles.previewMacroItem}>
                <Text style={[styles.previewMacroVal, { color: Palette.protein }]}>
                  {previewP}g
                </Text>
                <Text style={styles.previewMacroLbl}>Protein</Text>
              </View>
              <View style={styles.previewMacroItem}>
                <Text style={[styles.previewMacroVal, { color: Palette.carbs }]}>
                  {previewC}g
                </Text>
                <Text style={styles.previewMacroLbl}>Carbs</Text>
              </View>
              <View style={styles.previewMacroItem}>
                <Text style={[styles.previewMacroVal, { color: Palette.fat }]}>
                  {previewF}g
                </Text>
                <Text style={styles.previewMacroLbl}>Fat</Text>
              </View>
            </View>

            <Button
              title={`Log to ${selectedMeal.toUpperCase()} 🚀`}
              onPress={handleLogSelected}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginTop: Spacing.md }}
            />
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  cancelBtn: {
    padding: Spacing.xs,
  },
  cancelText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
  },
  headerTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  mealSelectorRow: {
    flexDirection: 'row',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.full,
    padding: 3,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  mealOptionBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: BorderRadius.full,
  },
  mealOptionActive: {
    backgroundColor: Palette.primary,
  },
  mealOptionText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
  },
  mealOptionTextActive: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.heavy,
  },
  segmentedControl: {
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
  },
  searchSubmitBtn: {
    backgroundColor: Palette.cyan,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.sm,
  },
  searchSubmitText: {
    color: Palette.textInverse,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.bold,
  },
  barcodeCard: {
    marginBottom: Spacing.xs,
    padding: Spacing.md,
  },
  barcodeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  barcodeTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  barcodeInputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  barcodeInput: {
    flex: 1,
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  barcodeLookupBtn: {
    width: 44,
    height: 44,
    backgroundColor: Palette.primary,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  loadingText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  foodList: {
    gap: Spacing.xs,
  },
  foodItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  foodItemCardSelected: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  foodItemLeft: {
    flex: 1,
  },
  foodItemName: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  foodItemBrand: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
    marginTop: 2,
  },
  foodItemMacros: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
    marginTop: 4,
  },
  foodItemRight: {
    alignItems: 'flex-end',
  },
  foodItemCals: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title3,
    fontWeight: Typography.fontWeights.heavy,
  },
  foodItemKcalLabel: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
  },
  customForm: {
    gap: Spacing.xs,
  },
  macroInputsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  previewCard: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
  previewTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  servingAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  servingLabel: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  servingInput: {
    width: 60,
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: Palette.textPrimary,
    textAlign: 'center',
    fontWeight: Typography.fontWeights.bold,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  previewMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingTop: Spacing.sm,
  },
  previewMacroItem: {
    alignItems: 'center',
  },
  previewMacroVal: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  previewMacroLbl: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.micro,
    marginTop: 2,
  },
});
