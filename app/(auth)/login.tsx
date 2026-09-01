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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Palette } from '../../constants/colors';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError(null);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.error) {
      if (res.error.message.toLowerCase().includes('invalid login credentials')) {
        setError('Invalid email or password. If you just created this account, please check your email inbox for the Supabase confirmation link (or disable "Confirm email" in your Supabase Auth settings).');
      } else {
        setError(res.error.message || 'Failed to sign in. Please verify your credentials.');
      }
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
          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <View style={[styles.brandBadge, Shadows.glowPrimary]}>
              <Ionicons name="flash" size={36} color={Palette.primary} />
            </View>
            <Text style={styles.brandTitle}>APEXFIT</Text>
            <Text style={styles.brandSubtitle}>Unified Workout & Nutrition Tracker</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSub}>Log in to continue your fitness progress</Text>

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

            <InputField
              label="Password"
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

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotBtn}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Forgot password?"
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          {/* Sign Up Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/signup')}
              style={styles.signUpLink}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel="Sign up for a new account"
            >
              <Text style={styles.signUpLinkText}>Sign Up</Text>
            </TouchableOpacity>
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    borderWidth: 2,
    borderColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    color: Palette.textPrimary,
    fontSize: 28,
    fontWeight: Typography.fontWeights.black,
    letterSpacing: -0.8,
  },
  brandSubtitle: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.heavy,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  formTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.bold,
    marginBottom: 4,
  },
  formSub: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.subhead,
    marginBottom: Spacing.lg,
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
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  forgotText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.semibold,
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
  signUpLink: {
    padding: Spacing.xs,
  },
  signUpLinkText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
  },
});
