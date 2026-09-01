import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../constants/colors';
import { Typography, Spacing, BorderRadius } from '../constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found', headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="alert-circle-outline" size={48} color={Palette.primary} />
        </View>
        <Text style={styles.title}>Screen Not Found</Text>
        <Text style={styles.subtitle}>This route does not exist.</Text>

        <Link href="/(tabs)" style={styles.link}>
          <Text style={styles.linkText}>Return to Home Dashboard</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.bgApp,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 245, 155, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSizes.title2,
    fontWeight: Typography.fontWeights.black,
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.fontSizes.subhead,
    color: Palette.textSecondary,
    marginBottom: Spacing.xl,
  },
  link: {
    backgroundColor: Palette.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  linkText: {
    fontSize: Typography.fontSizes.subhead,
    fontWeight: Typography.fontWeights.bold,
    color: Palette.textInverse,
  },
});
