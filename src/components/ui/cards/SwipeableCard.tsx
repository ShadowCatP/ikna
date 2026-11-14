import type { Card } from '@/types/card';
import { useState } from 'react';
import { Alert, Dimensions, Pressable, Text, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Lucide } from '../icons';

const SWIPE_THRESHOLD = 120;
const DISMISS_DISTANCE = Dimensions.get('window').width;

type SwipeableCardProps = {
  card: Card;
  onDelete: () => Promise<void>;
  onPress: () => void;
};

export function SwipeableCard({ card, onDelete, onPress }: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleDelete() {
    setIsDeleting(true);
    void onDelete().catch((error: unknown) => {
      setIsDeleting(false);
      translateX.value = withTiming(0, { duration: 180 });
      Alert.alert(
        'Could not delete card',
        error instanceof Error ? error.message : 'Please try again.',
        [{ text: 'OK' }]
      );
    });
  }

  const panGesture = usePanGesture({
    enabled: !isDeleting,
    activeOffsetX: [-10, 10],
    failOffsetY: [-15, 15],
    onUpdate: (event) => {
      translateX.value = Math.min(0, event.translationX);
    },
    onFinalize: () => {
      if (translateX.value <= -SWIPE_THRESHOLD) {
        translateX.value = withTiming(
          -DISMISS_DISTANCE,
          { duration: 180 },
          (finished) => {
            if (finished) scheduleOnRN(handleDelete);
          }
        );
      } else {
        translateX.value = withTiming(0, { duration: 180 });
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      layout={LinearTransition.duration(220)}
      className="relative overflow-hidden rounded-2xl"
    >
      <View className="bg-danger absolute inset-0 items-end justify-center px-6">
        <View className="items-center">
          <Lucide name="trash-2" className="text-background" size={20} />
          <Text className="text-background text-sm">Delete</Text>
        </View>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle} className="rounded-2xl">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Edit ${card.frontContent}`}
            onPress={onPress}
            className="bg-surface rounded-2xl px-4 py-4"
          >
            <Text className="text-foreground text-lg font-medium">
              {card.frontContent}
            </Text>
            <Text className="text-muted mt-2 text-base">
              {card.backContent}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
