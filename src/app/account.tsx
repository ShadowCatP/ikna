import { Ionicons } from '@/components/ui/Ionicons';
import { useAuth } from '@/hooks/useAuth';
import { type UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const email = user?.email || 'Guest account';

  function handleDeleteAccount() {
    Alert.alert('Delete account', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleEditName() {
    Alert.alert('Edit name', 'To be implemented', [{ text: 'OK' }]);
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        minHeight: '100%',
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-4">
        <View className="mb-7 flex-row items-center gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="bg-surface size-11 items-center justify-center rounded-full"
          >
            <Ionicons
              name="chevron-back"
              size={22}
              className="text-foreground"
            />
          </Pressable>
          <Text className="text-foreground text-2xl font-bold">Account</Text>
        </View>

        <View className="bg-surface overflow-hidden rounded-2xl">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit name"
            onPress={handleEditName}
            className="min-h-14 flex-row items-center px-4"
          >
            <Ionicons
              name="person-outline"
              size={22}
              className="text-foreground"
            />
            <Text className="text-foreground ml-3 flex-1 text-base">Name</Text>
            <Text className="text-muted text-base">{name}</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              className="text-muted ml-3"
            />
          </Pressable>
          <View className="bg-border h-px" />
          <View className="min-h-14 flex-row items-center px-4">
            <Ionicons
              name="mail-outline"
              size={22}
              className="text-foreground"
            />
            <Text className="text-foreground ml-3 flex-1 text-base">Email</Text>
            <Text className="text-muted text-base">{email}</Text>
          </View>
          <View className="bg-border h-px" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change password"
            onPress={() => router.push('/forgot-password')}
            className="min-h-14 flex-row items-center px-4"
          >
            <Ionicons
              name="lock-closed-outline"
              size={22}
              className="text-foreground"
            />
            <Text className="text-foreground ml-3 flex-1 text-base">
              Change password
            </Text>
            <Ionicons name="chevron-forward" size={20} className="text-muted" />
          </Pressable>
        </View>

        <View className="mt-auto">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            onPress={handleDeleteAccount}
            className="bg-surface min-h-12 flex-row items-center rounded-2xl px-4"
          >
            <Ionicons name="trash-outline" size={20} className="text-danger" />
            <Text className="text-danger ml-3 text-base">Delete account</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
