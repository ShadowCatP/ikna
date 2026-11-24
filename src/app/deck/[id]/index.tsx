import { useDeckCards } from '@/client/cards';
import { useDeck } from '@/client/decks';
import { DeckCardsScreen } from '@/components/screens/DeckCardsScreen';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { Lucide } from '@/components/ui/icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { deck, isLoading: isPending, isError, refetch } = useDeck(id);

  const {
    cards,
    isLoading: areCardsPending,
    isError: areCardsError,
    refetch: refetchCards,
  } = useDeckCards(id);

  function handleEdit() {
    router.push({
      pathname: '/deck/[id]/edit',
      params: {
        id,
        title: deck?.title,
        description: deck?.description ?? '',
      },
    });
  }

  function handleAddCard() {
    router.push({
      pathname: '/add-card',
      params: { deckId: id },
    });
  }

  function handleStartReview() {
    Alert.alert('Start review', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleEditCard(cardId: string, deckId: string) {
    router.push({
      pathname: '/card/[id]/edit',
      params: { id: cardId, deckId },
    });
  }

  if (isPending) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenLoading message="Loading deck..." />
      </Screen>
    );
  }

  if (isError || !deck) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenError onRetry={() => void refetch()} />
      </Screen>
    );
  }

  return (
    <Screen contentContainerClassName="grow">
      <ScreenHeader onBack={() => router.back()}>
        <View className="flex-1 flex-row items-center justify-between">
          <Text
            className="text-foreground mr-3 flex-1 text-2xl font-bold"
            numberOfLines={1}
          >
            {deck?.title ?? 'Deck'}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit deck"
            onPress={handleEdit}
            className="bg-surface size-12 items-center justify-center rounded-full"
          >
            <Lucide name="pencil" size={20} className="text-foreground" />
          </Pressable>
        </View>
      </ScreenHeader>

      <DeckCardsScreen
        deck={deck}
        cards={cards}
        onStartReview={handleStartReview}
        onAddCard={handleAddCard}
        onEditCard={handleEditCard}
        cardsLoading={areCardsPending}
        cardsError={areCardsError}
        onRetryCards={() => void refetchCards()}
      />
    </Screen>
  );
}
