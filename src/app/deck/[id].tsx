import { useDecks } from '@/client/decks';
import { Button } from '@/components/ui/common/Button';
import { Screen } from '@/components/ui/common/Screen';
import { ScreenHeader } from '@/components/ui/common/ScreenHeader';
import { Lucide } from '@/components/ui/icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Pressable, Text, View } from 'react-native';

export default function DeckScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: decks = [], isPending, isError } = useDecks();
  const deck = decks.find((item) => item.id === id);

  function handleEdit() {
    Alert.alert('Edit deck', 'To be implemented', [{ text: 'OK' }]);
  }

  function handleAddCard() {
    Alert.alert('Add card', 'To be implemented', [{ text: 'OK' }]);
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

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-base">Loading deck...</Text>
        </View>
      ) : isError || !deck ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted text-base">Could not load deck.</Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center py-8">
          <View className="relative mb-6 size-60 items-center justify-center">
            <View className="bg-accent absolute inset-0 rounded-full" />
            <Image
              accessibilityIgnoresInvertColors
              source={require('@/assets/images/ikna-waving.png')}
              className="size-64"
              resizeMode="contain"
            />
          </View>
          <Text className="text-foreground text-center text-3xl font-bold">
            No cards yet
          </Text>
          <Text className="text-muted mt-3 max-w-sm text-center text-base leading-6">
            {deck.description ||
              'Add your first card: a word on the front, its meaning on the back. It will show up in your daily review.'}
          </Text>
          <Button className="mt-8 w-full" onPress={handleAddCard}>
            <View className="flex-row items-center gap-2">
              <Lucide name="plus" size={22} color="white" />
              <Text className="text-background text-base font-medium">
                Add a card
              </Text>
            </View>
          </Button>
        </View>
      )}
    </Screen>
  );
}
