import { Lucide } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase, type UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
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
    router.replace('/welcome');
  }

  const handleSync = () => {
    Alert.alert('Sync', 'To be implemented', [{ text: 'OK' }]);
  };

  const handleThemeChange = () => {
    Alert.alert('Themes', 'To be implemented', [{ text: 'OK' }]);
  };

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-6 px-5">
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
              <Text className="text-foreground text-lg font-semibold">
                {name}
              </Text>
            )}
            <Text
              className={
                name ? 'text-foreground text-sm' : 'text-foreground text-lg'
              }
            >
              {email}
            </Text>
          </View>
          <Lucide name="chevron-right" size={22} className="text-foreground" />
        </Pressable>

        <View className="gap-2">
          <Text className="text-muted text-xs font-medium tracking-wide uppercase">
            Appearance
          </Text>
          <View className="bg-surface flex-row items-center rounded-2xl px-3 py-2">
            <Lucide name="eye" size={20} className="text-foreground" />
            <Text className="text-foreground ml-3 flex-1 text-sm">Theme</Text>
            <View className="bg-background flex-row items-center rounded-xl p-1">
              <Pressable
                className="rounded-lg px-2 py-1"
                onPress={handleThemeChange}
              >
                <Text className="text-muted text-xs">System</Text>
              </Pressable>
              <Pressable
                className="bg-foreground rounded-lg px-3 py-1"
                onPress={handleThemeChange}
              >
                <Text className="text-background text-xs">Light</Text>
              </Pressable>
              <Pressable
                className="rounded-lg px-2 py-1"
                onPress={handleThemeChange}
              >
                <Text className="text-muted text-xs">Dark</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-muted text-xs font-medium tracking-wide uppercase">
            Sync
          </Text>
          <View className="bg-surface overflow-hidden rounded-2xl">
            <View className="min-h-12 flex-row items-center px-3">
              <Lucide name="cloud" size={20} className="text-foreground" />
              <Text className="text-foreground ml-3 flex-1 text-sm">
                Synced
              </Text>
              <View className="flex-row items-center gap-1">
                <View className="bg-success size-2 rounded-full" />
                <Text className="text-muted text-sm">2 min ago</Text>
              </View>
            </View>
            <View className="bg-border h-px" />
            <Pressable
              className="min-h-12 flex-row items-center px-3"
              onPress={handleSync}
            >
              <Lucide name="refresh-cw" size={20} className="text-foreground" />
              <Text className="text-foreground ml-3 text-sm">Sync now</Text>
            </Pressable>
          </View>
        </View>

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
    </ScrollView>
  );
}
