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

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const validate = (): boolean => {
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
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

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    const res = await signUp(email, password, fullName);
    setLoading(false);

    if (res.error) {
      setError(res.error.message || 'Failed to create account. Please try again.');
    } else if (res.session) {
      // Session immediately active -> go to onboarding
      router.replace('/onboarding');
    } else {
      // Supabase email confirmation is enabled on this project
      setNeedsVerification(true);
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
          {/* Top Back Nav */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Go back to login"
          >
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>

          {needsVerification ? (
            /* Email Verification Confirmation State */
            <View style={styles.verificationCard}>
              <View style={[styles.brandBadge, Shadows.glowPrimary]}>
                <Ionicons name="mail-open" size={38} color={Palette.primary} />
              </View>
              <Text style={styles.verificationTitle}>Verify Your Email</Text>
              <Text style={styles.verificationSub}>
                We've sent a verification email to{' '}
                <Text style={{ color: Palette.textPrimary, fontWeight: '700' }}>
                  {email}
                </Text>
                . Please click the confirmation link in the email, then return to log in.
              </Text>

              <View style={styles.tipBox}>
                <Ionicons name="information-circle-outline" size={18} color={Palette.cyan} />
                <Text style={styles.tipText}>
                  Tip: To bypass email verification during development, turn off "Confirm email" in your Supabase Auth Settings.
                </Text>
              </View>

              <Button
                title="Go to Log In"
                onPress={() => router.replace('/(auth)/login')}
                variant="primary"
                size="lg"
                fullWidth
                style={{ marginTop: Spacing.lg }}
              />
            </View>
          ) : (
            /* Registration Form */
            <View>
              <View style={styles.brandContainer}>
                <View style={[styles.brandBadge, Shadows.glowPrimary]}>
                  <Ionicons name="person-add" size={32} color={Palette.primary} />
                </View>
                <Text style={styles.brandTitle}>Create Account</Text>
                <Text style={styles.brandSubtitle}>Start your APEXFIT fitness journey</Text>
              </View>

              <View style={styles.formContainer}>
                {error && (
                  <View style={styles.errorBanner} accessibilityRole="alert">
                    <Ionicons name="alert-circle" size={18} color={Palette.danger} />
                    <Text style={styles.errorBannerText}>{error}</Text>
                  </View>
                )}

                <InputField
                  label="Full Name"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (error) setError(null);
                  }}
                  placeholder="Alex Mercer"
                  autoCapitalize="words"
                  leftIcon="person-outline"
                />

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

                <InputField
                  label="Password (min. 6 characters)"
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
                  label="Confirm Password"
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
                  title="Create Account"
                  onPress={handleSignUp}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  fullWidth
                  style={{ marginTop: Spacing.sm }}
                />
              </View>

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/login')}
                  style={styles.loginLink}
                  accessible={true}
                  accessibilityRole="link"
                  accessibilityLabel="Log in to your account"
                >
                  <Text style={styles.loginLinkText}>Log In</Text>
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
    marginBottom: Spacing.md,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
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
    marginTop: 2,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
  },
  loginLink: {
    padding: Spacing.xs,
  },
  loginLinkText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
  verificationCard: {
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  verificationTitle: {
    color: Palette.textPrimary,
    fontSize: 24,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: Spacing.xs,
  },
  verificationSub: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 210, 255, 0.08)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0, 210, 255, 0.25)',
    gap: Spacing.sm,
    width: '100%',
  },
  tipText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    flex: 1,
    lineHeight: 18,
  },
});
