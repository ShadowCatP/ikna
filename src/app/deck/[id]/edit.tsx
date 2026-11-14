import { useDeck } from '@/client/decks';
import { EditDeckForm } from '@/components/forms/EditDeckForm';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenError } from '@/components/ui/common/ScreenError';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { ScreenLoading } from '@/components/ui/common/ScreenLoading';
import { router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function EditDeckScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const { data: deck, isPending, isError, refetch } = useDeck(id);

  return (
    <Screen
      contentContainerClassName="grow"
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader onBack={() => router.back()}>
        <Text className="text-foreground text-2xl font-bold">Edit deck</Text>
      </ScreenHeader>

      {isPending ? (
        <ScreenLoading message="Loading deck..." />
      ) : isError || !deck ? (
        <ScreenError onRetry={() => void refetch()} />
      ) : (
        <EditDeckForm deck={deck} />
      )}
    </Screen>
  );
}
