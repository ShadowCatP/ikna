import { Lucide } from '@/components/ui/icons';
import type { DeckPreview } from '@/types/deck';
import { Pressable, Text, View } from 'react-native';

type DeckCardProps = {
  deck: DeckPreview;
  onPress: () => void;
  onReview: () => void;
};

const accentStyles = {
  lavender: 'bg-primary',
  pink: 'bg-accent-secondary',
  green: 'bg-accent',
} as const;

export function DeckCard({ deck, onPress, onReview }: DeckCardProps) {
  const completed = deck.dueCount === 0;
  const initialsTextClassName =
    deck.accent === 'lavender' ? 'text-background' : 'text-foreground';

  return (
    <View className="bg-surface min-h-20 flex-row items-center rounded-2xl px-3 py-3">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${deck.title}`}
        onPress={onPress}
        className="min-w-0 flex-1 flex-row items-center"
      >
        {/* <View
          className={`${accentStyles[deck.accent]} size-12 items-center justify-center rounded-full`}
        >
          <Text className={`${initialsTextClassName} text-base font-medium`}>
            {deck.title
              .split(' ')
              .map((word) => word.charAt(0))
              .join('')}
          </Text>
        </View> */}
        <View className="ml-3 flex-1">
          <Text className="text-foreground text-base font-medium">
            {deck.title}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-muted text-sm">{deck.cardCount} cards</Text>
            {completed ? (
              <Text className="text-success text-sm">✓ Done for today</Text>
            ) : (
              <View className="bg-accent rounded-full px-2 py-1">
                <Text className="text-foreground text-xs font-medium">
                  {deck.dueCount} due
                </Text>
              </View>
            )}
          </View>
        </View>
        {completed ? (
          <Lucide name="chevron-right" size={22} className="text-muted" />
        ) : null}
      </Pressable>
      {!completed && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Review ${deck.title}`}
          onPress={onReview}
          className="bg-foreground ml-2 size-12 items-center justify-center rounded-full"
        >
          <Lucide name="play" size={18} color="white" />
        </Pressable>
      )}
    </View>
  );
}
