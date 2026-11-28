import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { UndoSnackbarProvider } from '@/components/ui/common/UndoSnackbarProvider';
import { useAuth } from '@/hooks/useAuth';
import '@/lib/legendState';
import {
  darkNavigationTheme,
  lightNavigationTheme,
} from '@/lib/navigation/navigationTheme';
import { useThemeStore } from '@/lib/themeStore';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  SplashScreen,
  Stack,
  ThemeProvider,
  type ErrorBoundaryProps,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Appearance, Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { queryClient } from '../lib/queryClient';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <Screen>
      <ScreenError message={error.message} onRetry={retry} />
    </Screen>
  );
}

export function SuspenseFallback() {
  return (
    <Screen>
      <ScreenLoading />
    </Screen>
  );
}

export default function RootLayout() {
  const { session, isReady } = useAuth();
  const themeMode = useThemeStore((state) => state.mode);
  const isDark = useColorScheme() === 'dark';
  const navigationTheme = isDark ? darkNavigationTheme : lightNavigationTheme;

  useEffect(() => {
    if (Platform.OS === 'web') return;
    Appearance.setColorScheme(
      themeMode === 'system' ? 'unspecified' : themeMode
    );
  }, [themeMode]);

  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(navigationTheme.colors.background);
  }, [navigationTheme]);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={navigationTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'none',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="auth/welcome" />
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="auth/forgot-password" />
            <Stack.Screen name="auth/reset-password" />
            <Stack.Protected guard={!!session}>
              <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
              <Stack.Screen name="settings/account" />
              <Stack.Screen name="settings/dev-tools" />
              <Stack.Screen name="add-deck" />
              <Stack.Screen name="card/[id]/edit" />
              <Stack.Screen name="deck/[id]" />
              <Stack.Screen name="deck/[id]/edit" />
            </Stack.Protected>
          </Stack>
          <UndoSnackbarProvider />
        </ThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
