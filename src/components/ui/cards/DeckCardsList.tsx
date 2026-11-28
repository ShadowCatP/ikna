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
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { ScreenError } from '../../screens/ScreenError';
import { ScreenLoading } from '../../screens/ScreenLoading';

type DeckCardsListProps = {
  deck: Deck;
  cards: Card[];
  isCardsLoading: boolean;
  hasCardsError: boolean;
  onRetryCards: () => void;
};

export function DeckCardsList({
  deck,
  cards,
  isCardsLoading,
  hasCardsError,
  onRetryCards,
}: DeckCardsListProps) {
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
  const cardCount = isCardsLoading ? deck.cardCount : visibleCards.length;

  function handleAddCard() {
    router.push({
      pathname: '/add-card',
      params: { deckId: deck.id },
    });
  }

  function handleEditCard(cardId: string, deckId: string) {
    router.push({
      pathname: '/card/[id]/edit',
      params: { id: cardId, deckId },
    });
  }

  if (!isCardsLoading && !hasCardsError && cards.length === 0) {
    return <EmptyDeckState onAddCard={handleAddCard} />;
  }

  return (
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
              onPress={handleAddCard}
            >
              <Lucide
                name="plus"
                size={22}
                className="text-on-accent-container"
              />
            </Button>
          )}
        </View>
      </View>

      {isCardsLoading ? (
        <ScreenLoading message="Loading cards..." />
      ) : hasCardsError ? (
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
              onPress={() => handleEditCard(card.id, card.deckId)}
              onDelete={() => deleteCard(card)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
