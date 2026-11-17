import { Lucide } from '@/components/ui/icons';
import { formatCardCount, formatDeckCount } from '@/utils/plural';
import { Image, Pressable, Text, View } from 'react-native';

type StudySummaryCardProps = {
  deckCount: number;
  dueCardCount: number;
  onStartReview: () => void;
};

export function StudySummaryCard({
  deckCount,
  dueCardCount,
  onStartReview,
}: StudySummaryCardProps) {
  return (
    <View className="bg-accent-container overflow-hidden rounded-3xl px-5 pt-5">
      <View className="flex-row items-stretch justify-between">
        <View className="w-1/2">
          <View className="bg-primary self-start rounded-full px-4 py-2">
            <Text className="text-background text-sm font-medium">Today</Text>
          </View>
          <Text className="text-on-accent-container mt-3 text-4xl font-bold">
            {formatCardCount(dueCardCount)}
          </Text>
          <Text className="text-on-accent-container mt-1 text-base">
            due today in {formatDeckCount(deckCount)}
          </Text>
        </View>
        <View className="-mr-2 aspect-square self-stretch">
          <Image
            source={require('@/assets/images/ikna-happy.png')}
            className="h-full w-full"
            resizeMode="contain"
            accessible={false}
          />
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start review"
        onPress={onStartReview}
        className="bg-cta-on-container mt-3 mb-5 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl"
      >
        <Lucide name="play" size={18} className="text-on-cta-on-container" />
        <Text className="text-on-cta-on-container text-base font-medium">
          Start review
        </Text>
      </Pressable>
    </View>
  );
}
