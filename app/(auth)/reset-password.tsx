import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Palette } from '../../constants/colors';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleUpdatePassword = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    const res = await updatePassword(password);
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Failed to update password. Please try again.');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.brandContainer}>
            <View style={[styles.brandBadge, Shadows.glowPrimary]}>
              <Ionicons name="lock-closed" size={32} color={Palette.primary} />
            </View>
            <Text style={styles.brandTitle}>Set New Password</Text>
            <Text style={styles.brandSubtitle}>
              Choose a strong password to secure your account.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {error && (
              <View style={styles.errorBanner} accessibilityRole="alert">
                <Ionicons name="alert-circle" size={18} color={Palette.danger} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            <InputField
              label="New Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              isPassword={true}
              autoCapitalize="none"
              leftIcon="lock-closed-outline"
            />

            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError(null);
              }}
              placeholder="••••••••"
              isPassword={true}
              autoCapitalize="none"
              leftIcon="shield-checkmark-outline"
            />

            <Button
              title="Update Password"
              onPress={handleUpdatePassword}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  brandBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    color: Palette.textPrimary,
    fontSize: 26,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -0.6,
  },
  brandSubtitle: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: Spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorBannerText: {
    color: Palette.danger,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
    flex: 1,
  },
});
