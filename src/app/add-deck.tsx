import { AddDeckForm } from '@/components/forms/AddDeckForm';
import { Screen } from '@/components/screens/Screen';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { router } from 'expo-router';
import { Text } from 'react-native';

export default function AddDeckScreen() {
  return (
    <Screen
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">New deck</Text>
      </ScreenHeader>

      <AddDeckForm />
    </Screen>
  );
}
