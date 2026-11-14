import { Screen } from '@/components/ui/common/Screen';
import { ScreenError } from '@/components/ui/common/ScreenError';
import { ScreenLoading } from '@/components/ui/common/ScreenLoading';
import { useAuth } from '@/hooks/useAuth';
import { QueryClientProvider } from '@tanstack/react-query';
import { SplashScreen, Stack, type ErrorBoundaryProps } from 'expo-router';
import { useEffect } from 'react';
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
  const { session, ready } = useAuth();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/welcome" />
          <Stack.Screen name="auth/sign-in" />
          <Stack.Screen name="auth/sign-up" />
          <Stack.Screen name="auth/forgot-password" />
          <Stack.Screen name="auth/reset-password" />
          <Stack.Protected guard={!!session}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="account" />
            <Stack.Screen name="add-deck" />
            <Stack.Screen name="card/[id]/edit" />
            <Stack.Screen name="deck/[id]" />
            <Stack.Screen name="deck/[id]/edit" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
