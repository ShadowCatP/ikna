import { Lucide } from '@/components/ui/icons';
import type { DeckPreview } from '@/types/deck';
import { Pressable, Text, View } from 'react-native';

type DeckCardProps = {
  deck: DeckPreview;
  onPress: () => void;
  onReview: () => void;
};

export function DeckCard({ deck, onPress, onReview }: DeckCardProps) {
  return (
    <View className="bg-surface min-h-20 flex-row items-center rounded-2xl px-3 py-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${deck.title}`}
        onPress={onPress}
        className="min-w-0 flex-1 flex-row items-center"
      >
        <View className="ml-3 flex-1">
          <Text className="text-foreground text-base font-medium">
            {deck.title}
          </Text>
          <Text className="text-muted mt-1 text-sm">
            Updated {new Date(deck.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <Lucide name="chevron-right" size={22} className="text-muted" />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Review ${deck.title}`}
        onPress={onReview}
        className="bg-foreground ml-2 size-12 items-center justify-center rounded-full"
      >
        <Lucide name="play" size={18} color="white" />
      </Pressable>
    </View>
  );
}
