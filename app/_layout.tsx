import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FitnessProvider, useFitness } from '../context/FitnessContext';
import { Palette } from '../constants/colors';
import { RestTimerModal } from '../components/workout/RestTimerModal';

function RootNavigation() {
  const { isHydrated, profile, restTimer, adjustRestTimer, stopRestTimer } = useFitness();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isHydrated) return;

    const inOnboarding = segments[0] === 'onboarding';

    if (!profile.isOnboarded && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [isHydrated, profile.isOnboarded, segments, router]);

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="light-content" backgroundColor={Palette.bgApp} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Palette.bgApp },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="workout/[id]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="workout/active"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="workout/summary"
          options={{
            presentation: 'fullScreenModal',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="workout/create"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="exercise/[id]"
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="nutrition/add-food"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="weight/log"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="onboarding/index"
          options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
        />
      </Stack>

      {/* Global Floating Rest Timer if active */}
      <RestTimerModal
        isActive={restTimer.isActive}
        targetSeconds={restTimer.targetSeconds}
        remainingSeconds={restTimer.remainingSeconds}
        exerciseName={restTimer.exerciseName}
        onAdjust={adjustRestTimer}
        onSkip={stopRestTimer}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FitnessProvider>
        <RootNavigation />
      </FitnessProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
});
