import { supabase } from '@/utils/supabase';
import { useLinkingURL } from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ResetPassword() {
  const url = useLinkingURL();
  const insets = useSafeAreaInsets();
  const [verifiedUrl, setVerifiedUrl] = useState<string | null>(null);
  const ready = !!url && verifiedUrl === url;
  const [busy, setBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    async function verifyLink() {
      try {
        const parsed = new URL(url!);
        const params = new URLSearchParams(parsed.hash.slice(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const linkError =
          params.get('error_description') ||
          parsed.searchParams.get('error_description');
        if (linkError)
          throw new Error(
            'This reset link has expired. Please request a new one.'
          );
        if (
          !accessToken ||
          !refreshToken ||
          params.get('type') !== 'recovery'
        ) {
          throw new Error(
            'Open the password reset link from your email to continue.'
          );
        }
        const { error: authError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (authError) throw authError;
        if (active) {
          setError(null);
          setVerifiedUrl(url);
        }
      } catch {
        if (active)
          setError(
            'This reset link is invalid or expired. Please request a new one.'
          );
      }
    }
    void verifyLink();
    return () => {
      active = false;
    };
  }, [url]);

  async function save() {
    if (!ready || busy) return;
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirm) {
      setError('Passwords don’t match');
      return;
    }
    setBusy(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) setError(authError.message);
      else {
        setPassword('');
        setConfirm('');
        router.replace('/home');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.form}>
          <Text style={styles.title}>Choose a new password</Text>
          <Text style={styles.description}>Use at least 8 characters.</Text>
          {!url && (
            <Text style={styles.error}>
              Open the password reset link from your email to continue.
            </Text>
          )}
          {!!url && !ready && !error && <ActivityIndicator color="#6C52FF" />}
          <TextInput
            accessibilityLabel="New password"
            placeholder="New password"
            placeholderTextColor="#62616F"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            value={password}
            onChangeText={setPassword}
            editable={ready && !busy}
            style={styles.input}
          />
          <TextInput
            accessibilityLabel="Confirm password"
            placeholder="Confirm password"
            placeholderTextColor="#62616F"
            secureTextEntry
            autoCapitalize="none"
            textContentType="newPassword"
            value={confirm}
            onChangeText={setConfirm}
            editable={ready && !busy}
            style={styles.input}
            onSubmitEditing={() => void save()}
          />
          {error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            disabled={!ready || busy}
            onPress={() => void save()}
            style={[styles.button, (!ready || busy) && styles.disabled]}
          >
            {busy ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Save password</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => router.replace('/sign-in')}
            style={styles.linkButton}
          >
            <Text style={styles.link}>Back to log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ECE8FF' },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  form: { width: '100%', maxWidth: 440, paddingHorizontal: 30 },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: '#111113',
    marginBottom: 12,
  },
  description: { fontSize: 16, color: '#62616F', marginBottom: 24 },
  input: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#111113',
    fontSize: 16,
    marginBottom: 12,
  },
  error: { color: '#8B1527', marginVertical: 12 },
  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: '#111113',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16 },
  disabled: { opacity: 0.6 },
  linkButton: { minHeight: 48, justifyContent: 'center', alignItems: 'center' },
  link: { color: '#111113', textDecorationLine: 'underline' },
});
