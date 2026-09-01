import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPasswordForEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await resetPasswordForEmail(email);
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Failed to send password reset email.');
    } else {
      setIsSubmitted(true);
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
          {/* Back Nav */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>

          {isSubmitted ? (
            /* Success Confirmation State */
            <View style={styles.successContainer}>
              <View style={[styles.successBadge, Shadows.glowPrimary]}>
                <Ionicons name="mail-open" size={40} color={Palette.primary} />
              </View>
              <Text style={styles.successTitle}>Check Your Inbox</Text>
              <Text style={styles.successSub}>
                We've sent a password reset link to{' '}
                <Text style={{ color: Palette.textPrimary, fontWeight: '700' }}>
                  {email}
                </Text>
                . Follow the instructions in the email to reset your password.
              </Text>

              <Button
                title="Return to Login"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.xl }}
              />
            </View>
          ) : (
            /* Request Form State */
            <View>
              <View style={styles.brandContainer}>
                <View style={[styles.brandBadge, Shadows.glowPrimary]}>
                  <Ionicons name="key" size={32} color={Palette.primary} />
                </View>
                <Text style={styles.brandTitle}>Reset Password</Text>
                <Text style={styles.brandSubtitle}>
                  Enter your email and we'll send you recovery instructions.
                </Text>
              </View>

              <View style={styles.formContainer}>
                {error && (
                  <View style={styles.errorBanner} accessibilityRole="alert">
                    <Ionicons name="alert-circle" size={18} color={Palette.danger} />
                    <Text style={styles.errorBannerText}>{error}</Text>
                  </View>
                )}

                <InputField
                  label="Email Address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError(null);
                  }}
                  placeholder="alex@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  leftIcon="mail-outline"
                />

                <Button
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  fullWidth
                  style={{ marginTop: Spacing.sm }}
                />
              </View>

              <View style={styles.footerRow}>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                  style={styles.loginLink}
                >
                  <Text style={styles.loginLinkText}>Back to Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingVertical: Spacing.md,
    justifyContent: 'center',
    minHeight: '100%',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
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
  footerRow: {
    alignItems: 'center',
  },
  loginLink: {
    padding: Spacing.xs,
  },
  loginLinkText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  successContainer: {
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    color: Palette.textPrimary,
    fontSize: 24,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  successSub: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    textAlign: 'center',
    lineHeight: 22,
  },
});
