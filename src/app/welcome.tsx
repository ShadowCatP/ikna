import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const contentWidth = Math.min(width, 440);
  const scale = contentWidth / 408;
  const [loading, setLoading] = useState(false);

  async function continueAsGuest() {
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/home');
        return;
      }
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        Alert.alert('Could not continue as guest', error.message);
      } else {
        router.replace('/home');
      }
    } catch {
      Alert.alert('Connection error', 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 items-center overflow-hidden bg-white">
      <View
        className="flex-1 items-center overflow-hidden"
        style={{
          width: contentWidth,
          paddingTop: Math.max(insets.top + 24, height * 0.225),
        }}
      >
        <View
          pointerEvents="none"
          className="bg-accent absolute -top-40 -left-32 size-80 rounded-full"
        />
        <View
          pointerEvents="none"
          className="bg-foreground absolute top-24 left-[51%] size-16 rounded-full"
        />
        <View
          pointerEvents="none"
          className="bg-accent-secondary absolute top-28 -right-16 size-40 rounded-full"
        />

        <View className="w-full max-w-md shrink-0 px-8">
          <Text
            className="text-foreground font-bold tracking-[-1px]"
            style={{ fontSize: 40 * scale, lineHeight: 46 * scale }}
          >
            Remember more,{'\n'}study less
          </Text>

          <Text className="text-foreground mt-2 mb-4 text-base leading-6">
            {"Hi, I'm Ikna! I'll help you learn with short daily reviews."}
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => router.push('/sign-up')}
            className="bg-foreground min-h-14 items-center justify-center rounded-2xl px-4 py-3.5 active:opacity-75"
          >
            <Text className="text-base font-medium text-white">
              Create account
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => router.push('/sign-in')}
            className="border-foreground bg-background mt-3 min-h-14 items-center justify-center rounded-2xl border-2 px-4 py-3.5 active:opacity-75"
          >
            <Text className="text-foreground text-base font-medium">
              Log in
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            disabled={loading}
            onPress={continueAsGuest}
            className="mt-0.5 min-h-12 items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator className="text-foreground" />
            ) : (
              <Text className="text-foreground text-base underline">
                Continue as guest
              </Text>
            )}
          </Pressable>
        </View>

        <View
          pointerEvents="none"
          className="absolute bottom-0 max-w-md shrink-0 items-center"
          style={{ width: contentWidth }}
        >
          <Image
            source={require('@/assets/images/ikna-welcome.png')}
            className="shrink-0"
            style={{
              width: contentWidth,
              height: (contentWidth * 1066) / 1190,
            }}
            resizeMode="contain"
            accessible={false}
          />
        </View>
      </View>
    </View>
  );
}
