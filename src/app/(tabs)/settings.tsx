import { useAccountProfile } from '@/client/account';
import { Screen } from '@/components/screens/Screen';
import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import { SyncStatusSection } from '@/components/ui/sections/SyncStatusSection';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore, type ThemeMode } from '@/lib/themeStore';
import { supabase, type UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { Section } from '../../components/ui/common/Section';

const themeOptions: { mode: ThemeMode; label: string }[] = [
  { mode: 'system', label: 'System' },
  { mode: 'light', label: 'Light' },
  { mode: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const { user } = useAuth();
  const { data: profile } = useAccountProfile(user?.id);
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const email = user?.email || 'Guest account';

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) {
      Alert.alert('Could not log out', error.message);
      setIsLoggingOut(false);
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
          onPress={() => router.push('/settings/account')}
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

        <Section title="Appearance">
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
        </Section>

        {profile?.allowDevTools && (
          <Section title="Dev Tools">
            <Button
              variant="surface"
              className="justify-start gap-3"
              onPress={() => router.push('/settings/dev-tools')}
            >
              <Lucide name="code-xml" size={20} className="text-foreground" />
              <Text className="text-foreground">Dev Tools</Text>
            </Button>
          </Section>
        )}

        <SyncStatusSection userId={user?.id} />

        <Button
          variant="destructive"
          accessibilityRole="button"
          accessibilityLabel="Log out"
          disabled={isLoggingOut}
          onPress={() => void handleLogout()}
          className="bg-surface min-h-12 justify-start gap-3"
        >
          {isLoggingOut ? (
            <ActivityIndicator className="text-danger" />
          ) : (
            <Lucide name="log-out" size={20} className="text-danger" />
          )}
          <Text className="text-danger text-sm">Log out</Text>
        </Button>
      </View>
    </Screen>
  );
}
