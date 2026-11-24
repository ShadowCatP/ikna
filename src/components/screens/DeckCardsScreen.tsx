import { EmptyDeckState } from '@/components/screens/EmptyDeckScreen';
import { SwipeableCard } from '@/components/ui/cards/SwipeableCard';
import { Button } from '@/components/ui/common/Button';
import { Search } from '@/components/ui/common/Search';

import { Lucide } from '@/components/ui/icons';
import {
  CARD_DELETION_KIND,
  useUndoableDeleteCard,
} from '@/hooks/useUndoableDeleteCard';
import { usePendingDeletions } from '@/lib/deletionStore';
import type { Card } from '@/types/card';
import type { Deck } from '@/types/deck';
import { formatCardCount } from '@/utils/plural';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ScreenError } from './ScreenError';
import { ScreenLoading } from './ScreenLoading';

type DeckCardsScreenProps = {
  deck: Deck;
  cards: Card[];
  onStartReview: () => void;
  onAddCard: () => void;
  onEditCard: (cardId: string, deckId: string) => void;
  cardsLoading: boolean;
  cardsError: boolean;
  onRetryCards: () => void;
};

export function DeckCardsScreen({
  deck,
  cards,
  onStartReview,
  onAddCard,
  onEditCard,
  cardsLoading,
  cardsError,
  onRetryCards,
}: DeckCardsScreenProps) {
  const deleteCard = useUndoableDeleteCard();
  const pendingCards = usePendingDeletions<Card>(CARD_DELETION_KIND);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const pendingIds = new Set(pendingCards.map((e) => e.id));
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleCards = cards.filter((card) => {
    if (pendingIds.has(card.id)) return false;
    if (!normalizedQuery) return true;

    return `${card.frontContent} ${card.backContent}`
      .toLowerCase()
      .includes(normalizedQuery);
  });
  const cardCount = cardsLoading ? deck.cardCount : visibleCards.length;

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

      <View className="gap-6">
        <View className="flex-row items-center justify-between gap-3">
          {!isSearchActive && (
            <Text className="text-foreground shrink text-2xl font-bold">
              Cards
            </Text>
          )}
          <View className={'flex-row items-center gap-3'}>
            {!isSearchActive && (
              <Text className="text-muted text-base">
                {formatCardCount(cardCount)}
              </Text>
            )}
            <Search
              value={searchQuery}
              onChangeText={setSearchQuery}
              onStartSearch={setIsSearchActive}
              accessibilityLabel="Search cards"
              placeholder="Search cards"
            />
            {!isSearchActive && (
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
            )}
          </View>
        </View>

        {cardsLoading ? (
          <ScreenLoading message="Loading cards..." />
        ) : cardsError ? (
          <ScreenError onRetry={onRetryCards} />
        ) : normalizedQuery && visibleCards.length === 0 ? (
          <Text className="text-muted">
            No cards match “{searchQuery.trim()}”.
          </Text>
        ) : (
          <View className="gap-3">
            {visibleCards.map((card) => (
              <SwipeableCard
                key={card.id}
                card={card}
                onPress={() => onEditCard(card.id, card.deckId)}
                onDelete={() => deleteCard(card)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
