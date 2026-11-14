import { Screen } from '@/components/ui/common/Screen';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { Lucide } from '@/components/ui/icons';
import { EditNameModal } from '@/components/ui/modals/EditNameModal';
import { useAuth } from '@/hooks/useAuth';
import { type UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

export default function AccountScreen() {
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const email = user?.email || 'Guest account';
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);

  function handleDeleteAccount() {
    Alert.alert('Delete account', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleEditName() {
    setIsNameModalVisible(true);
  }

  return (
    <Screen contentContainerStyle={{ minHeight: '100%' }}>
      <View className="flex-1">
        <ScreenHeader onBack={() => router.back()}>
          <Text className="text-foreground text-2xl font-bold">Account</Text>
        </ScreenHeader>

        <View className="bg-surface overflow-hidden rounded-2xl">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit name"
            onPress={handleEditName}
            className="min-h-14 flex-row items-center px-4"
          >
            <Lucide name="user" size={22} className="text-foreground" />
            <Text className="text-foreground ml-3 flex-1 text-base">Name</Text>
            <Text className="text-muted text-base">{name}</Text>
            <Lucide
              name="chevron-right"
              size={20}
              className="text-muted ml-3"
            />
          </Pressable>
          <View className="bg-border h-px" />
          <View className="min-h-14 flex-row items-center px-4">
            <Lucide name="mail" size={22} className="text-foreground" />
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
            <Lucide name="lock" size={22} className="text-foreground" />
            <Text className="text-foreground ml-3 flex-1 text-base">
              Change password
            </Text>
            <Lucide name="chevron-right" size={20} className="text-muted" />
          </Pressable>
        </View>

        <View className="mt-auto">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            onPress={handleDeleteAccount}
            className="bg-surface min-h-12 flex-row items-center rounded-2xl px-4"
          >
            <Lucide name="trash-2" size={20} className="text-danger" />
            <Text className="text-danger ml-3 text-base">Delete account</Text>
          </Pressable>
        </View>
      </View>

      <EditNameModal
        visible={isNameModalVisible}
        initialName={name ?? ''}
        onClose={() => setIsNameModalVisible(false)}
      />
    </Screen>
  );
}
