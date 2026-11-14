import { AddCardForm } from '@/components/forms/AddCardForm';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';

export default function AddCardScreen() {
  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen
        contentContainerClassName="grow"
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader onBack={() => router.back()}>
          <Text className="text-foreground text-2xl font-bold">New card</Text>
        </ScreenHeader>

        <AddCardForm />
      </Screen>
    </KeyboardAvoidingView>
  );
}
