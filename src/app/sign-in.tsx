import { supabase } from '@/utils/supabase';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { z } from 'zod';

const credentialsSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default function SignIn() {
  const { mode: initialMode } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'signIn' | 'signUp' | 'forgot'>(
    initialMode === 'signUp' ? 'signUp' : 'signIn'
  );
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const isNameStep = mode === 'signUp' && step === 2;
  const green = mode === 'signUp' && !isNameStep;
  const isForgot = mode === 'forgot';

  async function submit(skipName = false) {
    if (busy || info) return;
    setError(null);
    if (isForgot) {
      const parsedEmail = z
        .email('Enter a valid email address')
        .safeParse(email.trim());
      if (!parsedEmail.success) {
        setError(parsedEmail.error.issues[0].message);
        return;
      }
      setBusy(true);
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          parsedEmail.data,
          {
            redirectTo: 'ikna://reset-password',
          }
        );
        if (resetError) setError(resetError.message);
        else
          setInfo(
            'If an account exists for this email, you’ll receive a reset link.'
          );
      } catch {
        setError('Could not connect. Please try again.');
      } finally {
        setBusy(false);
      }
      return;
    }
    const parsed = credentialsSchema.safeParse({
      email: email.trim(),
      password,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      setStep(1);
      return;
    }
    if (mode === 'signUp' && step === 1) {
      setStep(2);
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signIn') {
        const { error: authError } = await supabase.auth.signInWithPassword(
          parsed.data
        );
        if (authError) setError(authError.message);
        else router.replace('/home');
      } else {
        const displayName = skipName ? '' : name.trim();
        const { data, error: authError } = await supabase.auth.signUp({
          ...parsed.data,
          options: { data: displayName ? { display_name: displayName } : {} },
        });
        if (authError) setError(authError.message);
        else if (data.session) router.replace('/home');
        else {
          setPassword('');
          setInfo(
            'Check your email to confirm your account. Then log in to continue.'
          );
        }
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function switchMode() {
    setMode(mode === 'signUp' ? 'signIn' : 'signUp');
    setStep(1);
    setError(null);
    setInfo(null);
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        green && styles.green,
        mode === 'signIn' && styles.pink,
        isForgot && styles.lavender,
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.canvas}>
          {isNameStep && (
            <>
              <View pointerEvents="none" style={styles.greenCircle} />
              <View pointerEvents="none" style={styles.pinkCircle} />
            </>
          )}
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              disabled={busy}
              onPress={() => {
                if (isNameStep && !info) {
                  setStep(1);
                  setError(null);
                } else if (isForgot) {
                  setMode('signIn');
                  setError(null);
                  setInfo(null);
                } else router.replace('/welcome');
              }}
              style={[styles.back, isNameStep && styles.soft]}
            >
              <Ionicons name="chevron-back" size={20} color="#111113" />
            </Pressable>
            {mode === 'signUp' && (
              <Text style={styles.step}>Step {step} of 2</Text>
            )}
          </View>

          <View
            pointerEvents="none"
            style={[styles.hero, isNameStep && styles.nameHero]}
          >
            <Image
              source={
                isNameStep
                  ? require('@/assets/images/ikna-happy.png')
                  : isForgot
                    ? require('@/assets/images/ikna-thinking.png')
                    : mode === 'signIn'
                      ? require('@/assets/images/ikna-waving.png')
                      : require('@/assets/images/ikna-excited.png')
              }
              style={isNameStep ? styles.happy : styles.excited}
              resizeMode="contain"
              accessible={false}
            />
            {isNameStep && (
              <Image
                source={require('@/assets/images/ikna-speech-bubble.png')}
                style={styles.bubble}
                resizeMode="contain"
                accessibilityLabel="Hi! I’m Ikna. What should I call you?"
              />
            )}
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>
              {isNameStep
                ? 'Nice to meet you!'
                : mode === 'signUp'
                  ? 'Ready to remember\nmore?'
                  : isForgot
                    ? 'Forgot your\npassword?'
                    : 'Hey, you’re back!'}
            </Text>
            {isForgot && (
              <Text style={[styles.description, styles.resetDescription]}>
                No worries — enter your email and we’ll send a reset link.
              </Text>
            )}
            {isNameStep ? (
              <>
                <Text style={styles.description}>
                  Ikna will use it to greet you. Optional — you can change it
                  later in Settings.
                </Text>
                <TextInput
                  accessibilityLabel="Your name"
                  placeholder="Your name"
                  placeholderTextColor="#62616F"
                  value={name}
                  onChangeText={setName}
                  maxLength={30}
                  autoComplete="given-name"
                  textContentType="givenName"
                  editable={!busy && !info}
                  style={[styles.input, styles.soft]}
                  returnKeyType="done"
                  onSubmitEditing={() => void submit()}
                />
                <Text style={styles.counter}>{name.length} / 30</Text>
              </>
            ) : (
              <>
                <TextInput
                  accessibilityLabel="Email"
                  placeholder="Email"
                  placeholderTextColor="#62616F"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={setEmail}
                  editable={!busy}
                  style={styles.input}
                  returnKeyType={isForgot ? 'send' : 'next'}
                  onSubmitEditing={isForgot ? () => void submit() : undefined}
                />
                {!isForgot && (
                  <View style={styles.password}>
                    <TextInput
                      accessibilityLabel="Password"
                      placeholder="Password"
                      placeholderTextColor="#62616F"
                      secureTextEntry={!visible}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete={
                        mode === 'signIn' ? 'current-password' : 'new-password'
                      }
                      textContentType={
                        mode === 'signIn' ? 'password' : 'newPassword'
                      }
                      value={password}
                      onChangeText={setPassword}
                      editable={!busy}
                      style={styles.passwordInput}
                      returnKeyType="go"
                      onSubmitEditing={() => void submit()}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={
                        visible ? 'Hide password' : 'Show password'
                      }
                      onPress={() => setVisible(!visible)}
                      style={styles.eye}
                    >
                      <Ionicons
                        name={visible ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color="#62616F"
                      />
                    </Pressable>
                  </View>
                )}
                {mode === 'signIn' && (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => {
                      setMode('forgot');
                      setError(null);
                      setInfo(null);
                    }}
                    style={styles.forgot}
                  >
                    <Text style={styles.link}>Forgot password?</Text>
                  </Pressable>
                )}
                {mode === 'signUp' && (
                  <Text style={styles.hint}>At least 8 characters</Text>
                )}
              </>
            )}
            {error && (
              <Text accessibilityRole="alert" style={styles.error}>
                {error}
              </Text>
            )}
            {info && (
              <Text accessibilityRole="alert" style={styles.info}>
                {info}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              disabled={busy || !!info}
              onPress={() => void submit()}
              style={({ pressed }) => [
                styles.primary,
                (mode === 'signIn' || isForgot) && styles.loginPrimary,
                (pressed || busy || !!info) && styles.dimmed,
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryText}>
                  {isNameStep
                    ? 'Create account'
                    : mode === 'signUp'
                      ? 'Continue'
                      : isForgot
                        ? 'Send reset link'
                        : 'Log in'}
                </Text>
              )}
            </Pressable>
            {isNameStep && !info ? (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={() => void submit(true)}
                style={styles.footer}
              >
                <Text style={styles.link}>Skip for now</Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={
                  isForgot
                    ? () => {
                        setMode('signIn');
                        setError(null);
                        setInfo(null);
                      }
                    : switchMode
                }
                style={styles.footer}
              >
                <Text style={styles.footerText}>
                  {mode === 'signUp'
                    ? 'Already have an account? '
                    : isForgot
                      ? 'Remembered it? '
                      : 'New here? '}
                  <Text style={styles.link}>
                    {mode === 'signUp' || isForgot
                      ? 'Log in'
                      : 'Create account'}
                  </Text>
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  green: { backgroundColor: '#A8EF7C' },
  pink: { backgroundColor: '#EFA5EF' },
  lavender: { backgroundColor: '#ECE8FF' },
  resetDescription: { color: '#111113' },
  forgot: { minHeight: 44, alignItems: 'flex-end', justifyContent: 'center' },
  loginPrimary: { marginTop: 4 },
  scroll: { flexGrow: 1, alignItems: 'center', overflow: 'hidden' },
  canvas: { width: '100%', maxWidth: 440 },
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  step: { fontSize: 12, color: '#62616F', marginRight: 4 },
  hero: { height: 220, alignItems: 'center', marginTop: -44 },
  excited: { width: 220, height: 220 },
  nameHero: { height: 300, marginTop: 12 },
  happy: {
    position: 'absolute',
    width: 190,
    height: 210,
    left: '18%',
    bottom: 16,
  },
  bubble: {
    position: 'absolute',
    width: 132,
    height: 94,
    right: '11%',
    top: 16,
  },
  greenCircle: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    right: -84,
    top: -100,
    backgroundColor: '#A8EF7C',
  },
  pinkCircle: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    left: -48,
    top: 264,
    backgroundColor: '#EFA5EF',
  },
  form: { paddingHorizontal: 30 },
  title: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: '#111113',
    marginTop: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#62616F',
    marginTop: -8,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#111113',
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  soft: { backgroundColor: '#F4F3F7' },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    minHeight: 54,
  },
  passwordInput: {
    flex: 1,
    color: '#111113',
    fontSize: 16,
    paddingLeft: 16,
    paddingVertical: 14,
  },
  eye: {
    width: 48,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: { fontSize: 12, marginTop: 8, color: '#111113' },
  counter: {
    fontSize: 12,
    color: '#62616F',
    textAlign: 'right',
    marginTop: -4,
  },
  primary: {
    backgroundColor: '#111113',
    borderRadius: 16,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500' },
  dimmed: { opacity: 0.6 },
  footer: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 14, color: '#111113', textAlign: 'center' },
  link: { fontSize: 14, color: '#111113', textDecorationLine: 'underline' },
  error: { color: '#8B1527', fontSize: 14, lineHeight: 20, marginTop: 12 },
  info: { color: '#275E34', fontSize: 14, lineHeight: 20, marginTop: 12 },
});
