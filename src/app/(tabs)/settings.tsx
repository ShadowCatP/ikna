import { Screen } from '@/components/screens/Screen';
import { SyncStatusSection } from '@/components/screens/SyncStatusSection';
import { Lucide } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore, type ThemeMode } from '@/lib/themeStore';
import { supabase, type UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

const themeOptions: { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'System' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { user } = useAuth();
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);
  const [loggingOut, setLoggingOut] = useState(false);
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const email = user?.email || 'Guest account';

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      Alert.alert('Could not log out', error.message);
      setLoggingOut(false);
      return;
    }
    router.replace('/auth/welcome');
  }

  return (
    <Screen contentContainerClassName="px-5">
      <View className="gap-6">
        <Text className="text-foreground text-2xl font-bold">Settings</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open account settings"
          onPress={() => router.push('/account')}
          className="bg-accent-secondary flex-row items-center rounded-2xl px-4 py-3"
        >
          <View className="bg-background size-14 items-center justify-center rounded-full">
            <Text className="text-foreground text-xl font-medium">
              {(name || email).charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="ml-3 flex-1">
            {name && (
              <Text className="text-on-accent-container text-lg font-semibold">
                {name}
              </Text>
            )}
            <Text
              className={
                name
                  ? 'text-on-accent-container text-sm'
                  : 'text-on-accent-container text-lg'
              }
            >
              {email}
            </Text>
          </View>
          <Lucide
            name="chevron-right"
            size={22}
            className="text-on-accent-container"
          />
        </Pressable>

        <View className="gap-2">
          <Text className="text-muted text-xs font-medium tracking-wide uppercase">
            Appearance
          </Text>
          <View className="bg-surface flex-row items-center rounded-2xl px-3 py-2">
            <Lucide name="eye" size={20} className="text-foreground" />
            <Text className="text-foreground ml-3 flex-1 text-sm">Theme</Text>
            <View className="bg-background flex-row items-center rounded-xl p-1">
              {themeOptions.map(({ mode, label }) => {
                const isActive = themeMode === mode;

                return (
                  <Pressable
                    key={mode}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    className={
                      isActive
                        ? 'bg-cta w-16 items-center rounded-lg py-1'
                        : 'w-16 items-center rounded-lg py-1'
                    }
                    onPress={() => setThemeMode(mode)}
                  >
                    <Text
                      className={
                        isActive ? 'text-on-cta text-xs' : 'text-muted text-xs'
                      }
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <SyncStatusSection userId={user?.id} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Log out"
          disabled={loggingOut}
          onPress={() => void handleLogout()}
          className="bg-surface min-h-12 flex-row items-center rounded-2xl px-3"
        >
          {loggingOut ? (
            <ActivityIndicator className="text-danger" />
          ) : (
            <Lucide name="log-out" size={20} className="text-danger" />
          )}
          <Text className="text-danger ml-3 text-sm">Log out</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
