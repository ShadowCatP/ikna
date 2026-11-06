import { useDecks } from '@/client/decks';
import { DeckCard } from '@/components/ui/cards/DeckCard';
import { StudySummaryCard } from '@/components/ui/cards/StudySummaryCard';
import { Lucide } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import { formatDeckCount } from '@/utils/plural';
import type { UserMetadata } from '@/utils/supabase';
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
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

  function handleDeckPress(title: string) {
    Alert.alert(title, 'To be implemented', [{ text: 'OK' }]);
  }

  function handleDeckReview(title: string) {
    Alert.alert(`Review ${title}`, 'To be implemented', [{ text: 'OK' }]);
  }

  function handleSearch() {
    Alert.alert('Search decks', 'To be implemented', [{ text: 'OK' }]);
  }

  return (
    <ScrollView
      className="bg-background flex-1"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => {
            refetch();
          }}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-7 px-4">
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
          <Text className="text-muted text-base">Loading decks...</Text>
        ) : isError ? (
          <Text className="text-muted text-base">Could not load decks.</Text>
        ) : (
          <View className="gap-3">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onPress={() => handleDeckPress(deck.title)}
                onReview={() => handleDeckReview(deck.title)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
