import { AddCardForm } from '@/components/forms/AddCardForm';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';

export default function AddCardScreen() {
  const { deckId } = useLocalSearchParams<{ deckId?: string }>();

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

        <AddCardForm initialDeckId={deckId} />
      </Screen>
    </KeyboardAvoidingView>
  );
}
