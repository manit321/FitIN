import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '../../constants/colors';
import { Typography, Spacing } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Palette.bgCard,
          borderTopWidth: 1,
          borderTopColor: Palette.borderSubtle,
          height: 60 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 8,
          elevation: 2,
          shadowColor: '#64748B',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: Palette.textMuted,
        tabBarLabelStyle: {
          fontSize: Typography.fontSizes.micro,
          fontWeight: Typography.fontWeights.semibold,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'barbell' : 'barbell-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: 'Nutrition',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'restaurant' : 'restaurant-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'trending-up' : 'trending-up-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
