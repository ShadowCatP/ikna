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

  async function openAuth(mode: 'signIn' | 'signUp') {
    if (mode === 'signIn') {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/home');
        return;
      }
    }
    router.push({
      pathname: '/sign-in',
      params: { mode },
    });
  }

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
          className="absolute -top-[155px] -left-[134px] size-[310px] rounded-full bg-[#A8EF7C]"
        />
        <View
          pointerEvents="none"
          className="absolute top-[95px] left-[51%] size-[66px] rounded-full bg-[#111113]"
        />
        <View
          pointerEvents="none"
          className="absolute top-[108px] -right-[60px] size-[156px] rounded-full bg-[#EFA5EF]"
        />

        <View className="w-full max-w-[440px] shrink-0 px-[32px]">
          <Text
            className="font-bold tracking-[-1px] text-[#111113]"
            style={{ fontSize: 40 * scale, lineHeight: 46 * scale }}
          >
            Remember more,{'\n'}study less
          </Text>

          <Text className="mt-[8px] mb-[16px] text-[16px] leading-[25px] text-[#111113]">
            Hi, I’m Ikna! I’ll help you learn with short daily reviews.
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => openAuth('signUp')}
            className="min-h-[58px] items-center justify-center rounded-[17px] bg-[#111113] px-[16px] py-[14px] active:opacity-75"
          >
            <Text className="text-[16px] font-medium text-white">
              Create account
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => openAuth('signIn')}
            className="mt-[12px] min-h-[58px] items-center justify-center rounded-[17px] border-2 border-[#111113] bg-white px-[16px] py-[14px] active:opacity-75"
          >
            <Text className="text-[16px] font-medium text-[#111113]">
              Log in
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            disabled={loading}
            onPress={continueAsGuest}
            className="mt-[2px] min-h-[48px] items-center justify-center"
          >
            {loading ? (
              <ActivityIndicator color="#111113" />
            ) : (
              <Text className="text-[16px] text-[#111113] underline">
                Continue as guest
              </Text>
            )}
          </Pressable>
        </View>

        <View
          pointerEvents="none"
          className="absolute bottom-0 max-w-[440px] shrink-0 items-center"
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
