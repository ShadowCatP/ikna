import { useDecks } from '@/client/decks';
import { DeckCard } from '@/components/ui/cards/DeckCard';
import { StudySummaryCard } from '@/components/ui/cards/StudySummaryCard';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenError } from '@/components/ui/common/ScreenError';
import { ScreenLoading } from '@/components/ui/common/ScreenLoading';
import { Lucide } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { formatDeckCount } from '@/utils/plural';
import type { UserMetadata } from '@/utils/supabase';
import { router } from 'expo-router';
import { Alert, Pressable, RefreshControl, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const {
    data: decks = [],
    isError,
    isPending,
    isRefetching,
    refetch,
  } = useDecks();
  const metadata = user?.user_metadata as UserMetadata | undefined;
  const name = metadata?.display_name || metadata?.name || metadata?.full_name;
  const greetingName = name || 'there';

  function handleStartReview() {
    Alert.alert('Start review', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleDeckReview(title: string) {
    Alert.alert(`Review ${title}`, 'To be implemented', [{ text: 'OK' }]);
  }

  function handleSearch() {
    Alert.alert('Search decks', 'To be implemented', [{ text: 'OK' }]);
  }

  return (
    <Screen
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
        />
      }
    >
      <View className="gap-7">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">
            Hi, {greetingName}!
          </Text>
        </View>

        <StudySummaryCard
          deckCount={decks.length}
          onStartReview={handleStartReview}
        />

        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">Your decks</Text>
          <View className="flex-row items-center gap-4">
            <Text className="text-muted text-base">
              {formatDeckCount(decks.length)}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search decks"
              onPress={handleSearch}
              className="bg-surface size-11 items-center justify-center rounded-full"
            >
              <Lucide name="search" size={22} />
            </Pressable>
          </View>
        </View>

        {isPending ? (
          <ScreenLoading message="Loading decks..." />
        ) : isError ? (
          <ScreenError onRetry={() => void refetch()} />
        ) : (
          <View className="gap-3">
            {decks.map((deck) => (
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
      </View>
    </Screen>
  );
}
