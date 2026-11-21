import { useCard } from '@/client/cards';
import { EditCardForm } from '@/components/forms/EditCardForm';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function EditCardScreen() {
  const { id, deckId } = useLocalSearchParams<{ id: string; deckId: string }>();

  const {
    card,
    isLoading,
    isError,
    error,
    refetch: refetchCards,
  } = useCard(deckId, id);

  return (
    <Screen
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">Edit card</Text>
      </ScreenHeader>

      {isLoading && !card ? (
        <ScreenLoading message="Loading card..." />
      ) : isError && !card ? (
        <ScreenError message={error?.message} onRetry={refetchCards} />
      ) : card ? (
        <EditCardForm card={card} />
      ) : (
        <ScreenError message="Card not found." />
      )}
    </Screen>
  );
}
