import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
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
    <View style={styles.screen}>
      <View
        style={[
          styles.canvas,
          {
            width: contentWidth,
            paddingTop: Math.max(insets.top + 24, height * 0.225),
          },
        ]}
      >
        <View pointerEvents="none" style={styles.greenCircle} />
        <View pointerEvents="none" style={styles.blackCircle} />
        <View pointerEvents="none" style={styles.pinkCircle} />

        <View style={styles.form}>
          <Text
            style={[
              styles.title,
              { fontSize: 40 * scale, lineHeight: 46 * scale },
            ]}
          >
            Remember more,{'\n'}study less
          </Text>

          <Text style={styles.description}>
            Hi, I’m Ikna! I’ll help you learn with short daily reviews.
          </Text>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => openAuth('signUp')}
            style={({ pressed }) => [
              styles.button,
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryText}>Create account</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => openAuth('signIn')}
            style={({ pressed }) => [
              styles.button,
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.secondaryText}>Log in</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue as guest"
            disabled={loading}
            onPress={continueAsGuest}
            style={styles.guestButton}
          >
            {loading ? (
              <ActivityIndicator color="#111113" />
            ) : (
              <Text style={styles.guestText}>Continue as guest</Text>
            )}
          </Pressable>
        </View>

        <View
          pointerEvents="none"
          style={[styles.art, { width: contentWidth }]}
        >
          <Image
            source={require('@/assets/images/ikna-welcome.png')}
            style={[
              styles.mascot,
              { width: contentWidth, height: (contentWidth * 1066) / 1190 },
            ]}
            resizeMode="contain"
            accessible={false}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
    width: '100%',
    maxWidth: 440,
    overflow: 'hidden',
    alignItems: 'center',
  },
  greenCircle: {
    position: 'absolute',
    width: 310,
    height: 310,
    borderRadius: 155,
    backgroundColor: '#A8EF7C',
    top: -155,
    left: -134,
  },
  blackCircle: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#111113',
    top: 95,
    left: '51%',
  },
  pinkCircle: {
    position: 'absolute',
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: '#EFA5EF',
    top: 108,
    right: -60,
  },
  form: {
    flexShrink: 0,
    width: '100%',
    maxWidth: 440,
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: -1,
    color: '#111113',
  },
  description: {
    fontSize: 16,
    lineHeight: 25,
    color: '#111113',
    marginTop: 8,
    marginBottom: 16,
  },
  button: {
    minHeight: 58,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: '#111113',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#111113',
    backgroundColor: '#FFFFFF',
    marginTop: 12,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  secondaryText: {
    color: '#111113',
    fontSize: 16,
    fontWeight: '500',
  },
  guestButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  guestText: {
    color: '#111113',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.75,
  },
  art: {
    position: 'absolute',
    bottom: 0,
    flexShrink: 0,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  mascot: {
    flexShrink: 0,
  },
});
