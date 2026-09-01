import { FoodItem } from '../types';

export interface OpenFoodFactsProduct {
  code: string;
  product_name?: string;
  brands?: string;
  categories?: string;
  serving_size?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    proteins_100g?: number;
    proteins_serving?: number;
    carbohydrates_100g?: number;
    carbohydrates_serving?: number;
    fat_100g?: number;
    fat_serving?: number;
    fiber_100g?: number;
    fiber_serving?: number;
  };
}

export const FoodService = {
  /**
   * Search Open Food Facts Database
   */
  async searchOpenFoodFacts(query: string): Promise<FoodItem[]> {
    if (!query || query.trim().length < 2) return [];

    try {
      const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        query.trim()
      )}&search_simple=1&action=process&json=1&page_size=10`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'APEXFIT-App - Android/iOS - Version 1.0',
        },
      });

      if (!response.ok) return [];

      const data = await response.json();
      if (!data.products || !Array.isArray(data.products)) return [];

      return data.products
        .filter((p: OpenFoodFactsProduct) => p.product_name)
        .map((p: OpenFoodFactsProduct) => {
          const cals = Math.round(p.nutriments?.['energy-kcal_100g'] || 0);
          const protein = Math.round((p.nutriments?.proteins_100g || 0) * 10) / 10;
          const carbs = Math.round((p.nutriments?.carbohydrates_100g || 0) * 10) / 10;
          const fat = Math.round((p.nutriments?.fat_100g || 0) * 10) / 10;
          const fiber = Math.round((p.nutriments?.fiber_100g || 0) * 10) / 10;

          return {
            id: `off-${p.code || Date.now()}-${Math.random().toString(36).substring(7)}`,
            name: p.product_name || 'Unknown Product',
            brand: p.brands || 'Open Food Facts',
            category: p.categories?.split(',')[0] || 'Packaged Foods',
            servingSize: p.serving_size || '100g',
            servingUnit: '100g',
            baseServingQty: 1,
            calories: cals,
            proteinG: protein,
            carbsG: carbs,
            fatG: fat,
            fiberG: fiber,
            isCustom: false,
          };
        });
    } catch (err) {
      console.warn('Open Food Facts search error:', err);
      return [];
    }
  },

  /**
   * Lookup a specific product by Barcode (EAN-13, UPC, etc.)
   */
  async lookupBarcode(barcode: string): Promise<FoodItem | null> {
    const cleaned = barcode.trim();
    if (!cleaned) return null;

    try {
      const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleaned)}.json`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'APEXFIT-App - Android/iOS - Version 1.0',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      if (!data.product || data.status !== 1) return null;

      const p: OpenFoodFactsProduct = data.product;
      const cals = Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal_serving'] || 0);
      const protein = Math.round((p.nutriments?.proteins_100g || p.nutriments?.proteins_serving || 0) * 10) / 10;
      const carbs = Math.round((p.nutriments?.carbohydrates_100g || p.nutriments?.carbohydrates_serving || 0) * 10) / 10;
      const fat = Math.round((p.nutriments?.fat_100g || p.nutriments?.fat_serving || 0) * 10) / 10;
      const fiber = Math.round((p.nutriments?.fiber_100g || p.nutriments?.fiber_serving || 0) * 10) / 10;

      return {
        id: `off-barcode-${cleaned}`,
        name: p.product_name || 'Scanned Product',
        brand: p.brands || 'Commercial Brand',
        category: p.categories?.split(',')[0] || 'Packaged Foods',
        servingSize: p.serving_size || '100g',
        servingUnit: 'serving',
        baseServingQty: 1,
        calories: cals,
        proteinG: protein,
        carbsG: carbs,
        fatG: fat,
        fiberG: fiber,
        isCustom: false,
      };
    } catch (err) {
      console.warn('Open Food Facts barcode error:', err);
      return null;
    }
  },
};
