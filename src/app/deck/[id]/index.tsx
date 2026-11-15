import { useCards } from '@/client/cards';
import { useDeck } from '@/client/decks';
import { DeckCardsScreen } from '@/components/screens/DeckCardsScreen';
import { EmptyDeckState } from '@/components/screens/EmptyDeckScreen';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { Lucide } from '@/components/ui/icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: deck, isPending, isError, refetch } = useDeck(id);
  const {
    data: cards = [],
    isPending: areCardsPending,
    isError: areCardsError,
    refetch: refetchCards,
  } = useCards(id);

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

  function handleSearch() {
    Alert.alert('Search cards', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleEditCard(cardId: string) {
    router.push({
      pathname: '/card/[id]/edit',
      params: { id: cardId },
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

  if (areCardsPending) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenLoading message="Loading cards..." />
      </Screen>
    );
  }

  if (areCardsError) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenError onRetry={() => void refetchCards()} />
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

      {cards.length === 0 ? (
        <EmptyDeckState onAddCard={handleAddCard} />
      ) : (
        <DeckCardsScreen
          deck={deck}
          cards={cards}
          onStartReview={handleStartReview}
          onSearch={handleSearch}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
        />
      )}
    </Screen>
  );
}
