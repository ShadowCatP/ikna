import { useDecks } from '@/client/decks';
import { EmptyDecksScreen } from '@/components/screens/EmptyDecksScreen';
import { Screen } from '@/components/screens/Screen';
import { ScreenError } from '@/components/screens/ScreenError';
import { ScreenHeader } from '@/components/screens/ScreenHeader';
import { ScreenLoading } from '@/components/screens/ScreenLoading';
import { DeckCard } from '@/components/ui/cards/DeckCard';
import { StudySummaryCard } from '@/components/ui/cards/StudySummaryCard';
import { Search } from '@/components/ui/common/Search';
import { useAuth } from '@/hooks/useAuth';
import { formatDeckCount } from '@/utils/plural';
import type { UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, RefreshControl, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const { decks, isError, isLoading, refetch } = useDecks();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const greetingName = name || 'there';
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleDecks = normalizedQuery
    ? decks.filter((deck) => {
        const searchableText =
          `${deck.title} ${deck.description ?? ''}`.toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
    : decks;

  function handleStartReview() {
    Alert.alert('Start review', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleDeckReview(title: string) {
    Alert.alert(`Review ${title}`, 'To be implemented', [{ text: 'OK' }]);
  }

  function handleCreateDeck() {
    router.push('/add-deck');
  }

  if (isLoading) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenLoading message="Loading decks..." />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen contentContainerClassName="grow">
        <ScreenError onRetry={() => void refetch()} />
      </Screen>
    );
  }

  const dueCardCount = decks.reduce(
    (total, deck) => total + deck.dueCardCount,
    0
  );

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => {
            refetch();
          }}
        />
      }
    >
      <View className="gap-6">
        <ScreenHeader>
          <Text className="text-foreground text-2xl font-bold">
            Hi, {greetingName}!
          </Text>
        </ScreenHeader>

        {decks.length === 0 ? (
          <EmptyDecksScreen onCreateDeck={handleCreateDeck} />
        ) : (
          <>
            <StudySummaryCard
              deckCount={decks.length}
              dueCardCount={dueCardCount}
              onStartReview={handleStartReview}
            />

            <View className="flex-row items-center justify-between">
              {!isSearchActive && (
                <Text className="text-foreground shrink text-2xl font-bold">
                  Your decks
                </Text>
              )}
              <View className={'flex-row items-center gap-4'}>
                {!isSearchActive && (
                  <Text className="text-muted text-base">
                    {formatDeckCount(decks.length)}
                  </Text>
                )}
                <Search
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onStartSearch={setIsSearchActive}
                  accessibilityLabel="Search decks"
                  placeholder="Search decks"
                />
              </View>
            </View>

            {normalizedQuery && visibleDecks.length === 0 ? (
              <Text className="text-muted text-base">
                No decks match “{searchQuery.trim()}”.
              </Text>
            ) : (
              <View className="gap-3">
                {visibleDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    onPress={() =>
                      router.push({
                        pathname: '/deck/[id]',
                        params: { id: deck.id },
                      })
                    }
                    onReview={() => handleDeckReview(deck.title)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </Screen>
  );
}
