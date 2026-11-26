import { syncAll, useGlobalSyncStatus } from '@/client/sync';
import { Section } from '@/components/ui/common/Section';
import { Lucide } from '@/components/ui/icons';
import { isOnline$ } from '@/lib/network';
import { formatRelativeTime } from '@/utils/date';
import { useValue } from '@legendapp/state/react';
import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Button } from '../common/Button';

const SPIN_DURATION_MS = 500;

export function SyncStatusSection({ userId }: { userId?: string }) {
  const [, setTick] = useState(0);
  const isOnline = useValue(() => isOnline$.get());
  const { lastSyncedAt, hasError, isSyncing } = useGlobalSyncStatus();
  const rotation = useSharedValue(0);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  useEffect(() => {
    if (isSyncing) {
      rotation.value = 0;
      rotation.value = withSequence(
        withTiming(360, {
          duration: SPIN_DURATION_MS * 2,
          easing: Easing.in(Easing.quad),
        }),
        withRepeat(
          withTiming(720, {
            duration: SPIN_DURATION_MS,
            easing: Easing.linear,
          }),
          -1
        )
      );
    } else if (rotation.value !== 0) {
      const remaining = 360 - (rotation.value % 360);
      rotation.value = withTiming(rotation.value + remaining, {
        duration: (2 * remaining * SPIN_DURATION_MS) / 360,
        easing: Easing.out(Easing.quad),
      });
    }

    return () => cancelAnimation(rotation);
  }, [isSyncing]);

  useEffect(() => {
    const timer = setInterval(() => setTick((tick) => tick + 1), 30_000);

    return () => clearInterval(timer);
  }, []);

  async function handleSync() {
    if (!userId || isSyncing || !isOnline) return;

    try {
      await syncAll(userId);
    } catch {
      Alert.alert('Sync failed');
    }
  }

  return (
    <Section title="Sync">
      <View className="bg-surface overflow-hidden rounded-2xl">
        <View className="min-h-12 flex-row items-center px-3">
          <Lucide name="cloud" size={20} className="text-foreground" />
          <Text className="text-foreground ml-3 flex-1 text-sm">
            Sync Status
          </Text>
          <View className="flex-row items-center gap-1">
            <View
              className={
                isOnline === false || hasError
                  ? 'bg-danger size-2 rounded-full'
                  : 'bg-success size-2 rounded-full'
              }
            />
            <Text className="text-muted text-sm">
              {isOnline === false
                ? 'Offline'
                : formatRelativeTime(lastSyncedAt)}
            </Text>
          </View>
        </View>
        <View className="bg-border h-px" />
        <Button
          variant="surface"
          className="h-12 min-h-12 justify-start py-0"
          disabled={isSyncing || !userId || !isOnline}
          onPress={() => void handleSync()}
        >
          <Animated.View style={animatedIconStyle}>
            <Lucide name="refresh-cw" size={20} className="text-foreground" />
          </Animated.View>
          <Text className="text-foreground ml-3 text-sm">Sync now</Text>
        </Button>
      </View>
    </Section>
  );
}
