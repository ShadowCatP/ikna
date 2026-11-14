import { useCard } from '@/client/cards';
import { EditCardForm } from '@/components/forms/EditCardForm';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function EditCardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: card, isPending, isError, refetch } = useCard(id);

  return (
    <Screen
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">Edit card</Text>
      </ScreenHeader>

      {isPending ? (
        <ScreenLoading message="Loading card..." />
      ) : isError || !card ? (
        <ScreenError onRetry={() => void refetch()} />
      ) : (
        <EditCardForm card={card} />
      )}
    </Screen>
  );
}
