import { useDeleteAccount } from '@/client/account';
import { Screen } from '@/components/screens/Screen';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { Button } from '@/components/ui/common/Button';
import { Modal } from '@/components/ui/common/Modal';
import { Lucide } from '@/components/ui/icons';
import { EditNameModal } from '@/components/ui/modals/EditNameModal';
import { useAuth } from '@/hooks/useAuth';
import { isOnline$ } from '@/lib/network';
import { supabase, type UserMetadata } from '@/utils/supabase';
import { useValue } from '@legendapp/state/react';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

export default function AccountScreen() {
  const { user } = useAuth();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const email = user?.email || 'Guest account';
  const deleteAccountMutation = useDeleteAccount();
  const isOnline = useValue(() => isOnline$.get());
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  function handleDeleteAccount() {
    if (!isOnline) {
      Alert.alert(
        'No internet connection',
        'Connect to the internet to delete your account.'
      );
      return;
    }
    setIsDeleteModalVisible(true);
  }

  async function handleConfirmDeleteAccount() {
    if (!isOnline) {
      Alert.alert(
        'No internet connection',
        'Connect to the internet to delete your account.'
      );
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync();
      setIsDeleteModalVisible(false);
      await supabase.auth.signOut();
      router.replace('/auth/welcome');
    } catch (error) {
      Alert.alert(
        'Could not delete account',
        error instanceof Error ? error.message : 'Please try again.',
        [{ text: 'OK' }]
      );
    }
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
            onPress={() => router.push('/auth/forgot-password')}
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
            disabled={deleteAccountMutation.isPending || !isOnline}
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

      <Modal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        closeAccessibilityLabel="Cancel delete account"
      >
        <Text className="text-foreground mb-2 text-2xl font-bold">
          Delete account?
        </Text>
        <Text className="text-muted mb-6 text-base leading-6">
          This action cannot be undone.
        </Text>
        <View className="gap-3">
          <Button
            variant="destructive"
            disabled={deleteAccountMutation.isPending || !isOnline}
            onPress={() => void handleConfirmDeleteAccount()}
          >
            <Text className="text-background text-base font-medium">
              Delete account
            </Text>
          </Button>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel delete account"
            onPress={() => setIsDeleteModalVisible(false)}
            disabled={deleteAccountMutation.isPending}
            className="bg-surface dark:border-foreground min-h-14 items-center justify-center rounded-2xl dark:border-2 dark:bg-transparent"
          >
            <Text className="text-foreground text-base font-medium">
              Cancel
            </Text>
          </Pressable>
        </View>
      </Modal>
    </Screen>
  );
}
