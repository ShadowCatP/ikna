import { useDecks } from '@/client/decks';
import { DeckCard } from '@/components/decks/DeckCard';
import { Lucide } from '@/components/ui/icons';
import { useAuth } from '@/hooks/useAuth';
import type { UserMetadata } from '@/utils/supabase';
import {
  Alert,
  Image,
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

        <View className="bg-accent overflow-hidden rounded-3xl px-5 pt-5">
          <View className="flex-row items-start justify-between">
            <View className="w-1/2">
              <View className="bg-primary self-start rounded-full px-4 py-2">
                <Text className="text-background text-sm font-medium">
                  Today
                </Text>
              </View>
              <Text className="text-foreground mt-3 text-4xl font-bold">
                {decks.length} decks
              </Text>
              <Text className="text-foreground mt-1 text-base">
                Ready for your next study session
              </Text>
            </View>
            <Image
              source={require('@/assets/images/ikna-happy.png')}
              className="mt-1 -mr-2 h-32 w-32"
              resizeMode="contain"
              accessible={false}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Start review"
            onPress={handleStartReview}
            className="bg-foreground mt-3 mb-5 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl"
          >
            <Lucide name="play" size={18} color="white" />
            <Text className="text-background text-base font-medium">
              Start review
            </Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-2xl font-bold">Your decks</Text>
          <View className="flex-row items-center gap-4">
            <Text className="text-muted text-base">{decks.length} decks</Text>
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
