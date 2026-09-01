import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T; icon?: React.ReactNode }[];
  selectedValue: T;
  onSelect: (value: T) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onSelect,
  scrollable = false,
  style,
}: SegmentedControlProps<T>) {
  const handleSelect = (val: T) => {
    if (val !== selectedValue) {
      Haptics.selectionAsync();
      onSelect(val);
    }
  };

  const renderButtons = () =>
    options.map((opt) => {
      const isSelected = opt.value === selectedValue;
      return (
        <TouchableOpacity
          key={opt.value}
          onPress={() => handleSelect(opt.value)}
          activeOpacity={0.8}
          style={[
            styles.segment,
            isSelected && styles.segmentSelected,
            scrollable && styles.segmentScrollable,
          ]}
        >
          {opt.icon && <View style={styles.icon}>{opt.icon}</View>}
          <Text
            style={[
              styles.segmentText,
              isSelected && styles.segmentTextSelected,
            ]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      );
    });

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, style]}
      >
        {renderButtons()}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {renderButtons()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 2,
    gap: Spacing.xs,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  segmentScrollable: {
    flex: 0,
    backgroundColor: Palette.bgCardElevated,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  segmentSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  icon: {
    marginRight: 4,
  },
  segmentText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
  },
  segmentTextSelected: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.bold,
  },
});
