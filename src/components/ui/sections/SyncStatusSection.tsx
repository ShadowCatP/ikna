import { syncAll, useGlobalSyncStatus } from '@/client/sync';
import { Lucide } from '@/components/ui/icons';
import { formatRelativeTime } from '@/utils/date';
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { Alert, Animated, Easing, Pressable, Text, View } from 'react-native';

const syncSpin = new Animated.Value(0);
const syncSpinRotation = syncSpin.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

export function SyncStatusSection({ userId }: { userId?: string }) {
  const [, setTick] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const { lastSyncedAt, hasError } = useGlobalSyncStatus();

  useEffect(() => {
    const timer = setInterval(() => setTick((tick) => tick + 1), 30_000);
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    void NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!syncing) {
      syncSpin.stopAnimation();
      syncSpin.setValue(0);
      return;
    }

    syncSpin.setValue(0);
    const animation = Animated.loop(
      Animated.timing(syncSpin, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [syncing]);

  async function handleSync() {
    if (!userId || syncing || !isConnected) return;

    setSyncing(true);
    const startedAt = Date.now();
    try {
      await syncAll(userId);
    } catch {
      Alert.alert('Sync failed');
    } finally {
      const elapsed = Date.now() - startedAt;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }
      setSyncing(false);
    }
  }

  return (
    <View className="gap-2">
      <Text className="text-muted text-xs font-medium tracking-wide uppercase">
        Sync
      </Text>
      <View className="bg-surface overflow-hidden rounded-2xl">
        <View className="min-h-12 flex-row items-center px-3">
          <Lucide name="cloud" size={20} className="text-foreground" />
          <Text className="text-foreground ml-3 flex-1 text-sm">
            Sync Status
          </Text>
          <View className="flex-row items-center gap-1">
            <View
              className={
                isConnected === false || hasError
                  ? 'bg-danger size-2 rounded-full'
                  : 'bg-success size-2 rounded-full'
              }
            />
            <Text className="text-muted text-sm">
              {isConnected === false
                ? 'Offline'
                : formatRelativeTime(lastSyncedAt)}
            </Text>
          </View>
        </View>
        <View className="bg-border h-px" />
        <Pressable
          className="min-h-12 flex-row items-center px-3"
          disabled={syncing || !userId || isConnected === false}
          onPress={() => void handleSync()}
        >
          <Animated.View
            style={
              syncing
                ? {
                    transform: [
                      {
                        rotate: syncSpinRotation,
                      },
                    ],
                  }
                : undefined
            }
          >
            <Lucide name="refresh-cw" size={20} className="text-foreground" />
          </Animated.View>
          <Text className="text-foreground ml-3 text-sm">Sync now</Text>
        </Pressable>
      </View>
    </View>
  );
}
