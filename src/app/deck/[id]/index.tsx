import { useDeckCards } from '@/client/cards';
import { useDeck } from '@/client/decks';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { DeckCardsList } from '@/components/ui/cards/DeckCardsList';
import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import { formatCardCount } from '@/utils/plural';
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

  function handleStartReview() {
    Alert.alert('Start review', 'To be implemented', [{ text: 'OK' }]);
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

      <View className="gap-6">
        <Text className="text-muted text-base">
          {deck.dueCardCount} due of {formatCardCount(deck.cardCount)}
        </Text>

        <Button onPress={handleStartReview}>
          <View className="flex-row items-center gap-2">
            <Lucide name="play" size={20} className="text-on-cta" />
            <Text className="text-on-cta text-base font-medium">
              Start review
            </Text>
          </View>
        </Button>

        <DeckCardsList
          deck={deck}
          cards={cards}
          cardsLoading={areCardsPending}
          cardsError={areCardsError}
          onRetryCards={() => void refetchCards()}
        />
      </View>
    </Screen>
  );
}
