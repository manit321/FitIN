import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface InputFieldProps extends TextInputProps {
  label?: string;
  unitSuffix?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  onClear?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  unitSuffix,
  error,
  containerStyle,
  icon,
  onClear,
  value,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.textInput}
          placeholderTextColor={Palette.textMuted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          {...rest}
        />
        {onClear && value && value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={Palette.textMuted} />
          </TouchableOpacity>
        )}
        {unitSuffix && <Text style={styles.unitSuffix}>{unitSuffix}</Text>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.semibold,
    marginBottom: Spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Palette.borderSubtle,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  inputFocused: {
    borderColor: Palette.primary,
    backgroundColor: Palette.bgCardElevated,
  },
  inputError: {
    borderColor: Palette.danger,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  textInput: {
    flex: 1,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.medium,
    height: '100%',
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  unitSuffix: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
    marginLeft: Spacing.xs,
  },
  errorText: {
    color: Palette.danger,
    fontSize: Typography.fontSizes.caption,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
