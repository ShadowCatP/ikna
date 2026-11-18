import { EmptyDeckState } from '@/components/screens/EmptyDeckScreen';
import { SwipeableCard } from '@/components/ui/cards/SwipeableCard';
import { Button } from '@/components/ui/common/Button';

import { Lucide } from '@/components/ui/icons';
import {
  CARD_DELETION_KIND,
  useUndoableDeleteCard,
} from '@/hooks/useUndoableDeleteCard';
import { usePendingDeletions } from '@/lib/deletionStore';
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
  const deleteCard = useUndoableDeleteCard();
  const pendingCards = usePendingDeletions<Card>(CARD_DELETION_KIND);

  const pendingIds = new Set(pendingCards.map((e) => e.id));
  const visibleCards = cards.filter((c) => !pendingIds.has(c.id));
  const cardCount =
    deck.cardCount -
    pendingCards.filter((e) => e.data.deckId === deck.id).length;

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
          <Lucide name="play" size={20} className="text-on-cta" />
          <Text className="text-on-cta text-base font-medium">
            Start review
          </Text>
        </View>
      </Button>

      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">Cards</Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-muted text-base">
              {formatCardCount(cardCount)}
            </Text>
            <Button
              size="icon"
              variant="surface"
              accessibilityLabel="Search cards"
              onPress={onSearch}
            >
              <Lucide name="search" size={23} className="text-foreground" />
            </Button>
            <Button
              size="icon"
              variant="accent"
              accessibilityLabel="Add a card"
              onPress={onAddCard}
            >
              <Lucide
                name="plus"
                size={24}
                className="text-on-accent-container"
              />
            </Button>
          </View>
        </View>

        {cardsLoading ? (
          <ScreenLoading message="Loading cards..." />
        ) : cardsError ? (
          <ScreenError onRetry={onRetryCards} />
        ) : (
          <View className="gap-3">
            {visibleCards.map((card) => (
              <SwipeableCard
                key={card.id}
                card={card}
                onPress={() => onEditCard(card.id)}
                onDelete={() => deleteCard(card)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
