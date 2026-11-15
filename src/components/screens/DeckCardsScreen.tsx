import { useDeleteCard } from '@/client/cards';
import { EmptyDeckState } from '@/components/screens/EmptyDeckScreen';
import { SwipeableCard } from '@/components/ui/cards/SwipeableCard';
import { Button } from '@/components/ui/common/Button';

import { Lucide } from '@/components/ui/icons';
import type { Card } from '@/types/card';
import type { DeckPreview } from '@/types/deck';
import { formatCardCount } from '@/utils/plural';
import { Text, View } from 'react-native';
import { ScreenError } from './ScreenError';
import { ScreenLoading } from './ScreenLoading';

type DeckCardsScreenProps = {
  deck: DeckPreview;
  cards: Card[];
  onStartReview: () => void;
  onSearch: () => void;
  onAddCard: () => void;
  onEditCard: (cardId: string) => void;
  cardsLoading: boolean;
  cardsError: boolean;
  onRetryCards: () => void;
};

export function DeckCardsScreen({
  deck,
  cards,
  onStartReview,
  onSearch,
  onAddCard,
  onEditCard,
  cardsLoading,
  cardsError,
  onRetryCards,
}: DeckCardsScreenProps) {
  const deleteCardMutation = useDeleteCard();

  if (!cardsLoading && !cardsError && cards.length === 0) {
    return <EmptyDeckState onAddCard={onAddCard} />;
  }

  return (
    <View className="gap-6">
      <Text className="text-muted text-base">
        {deck.dueCardCount} due of {formatCardCount(deck.cardCount)}
      </Text>

      <Button onPress={onStartReview}>
        <View className="flex-row items-center gap-2">
          <Lucide name="play" size={20} color="white" />
          <Text className="text-background text-base font-medium">
            Start review
          </Text>
        </View>
      </Button>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">Cards</Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-muted text-base">
              {formatCardCount(deck.cardCount)}
            </Text>
            <Button
              size="icon"
              variant="surface"
              accessibilityLabel="Search cards"
              onPress={onSearch}
            >
              <Lucide name="search" size={23} />
            </Button>
            <Button
              size="icon"
              variant="accent"
              accessibilityLabel="Add a card"
              onPress={onAddCard}
            >
              <Lucide name="plus" size={24} />
            </Button>
          </View>
        </View>

        {cardsLoading ? (
          <ScreenLoading message="Loading cards..." />
        ) : cardsError ? (
          <ScreenError onRetry={onRetryCards} />
        ) : (
          <View className="gap-3">
            {cards.map((card) => (
              <SwipeableCard
                key={card.id}
                card={card}
                onPress={() => onEditCard(card.id)}
                onDelete={() => deleteCardMutation.mutateAsync({ id: card.id })}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
