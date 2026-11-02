import { AuthButton } from '@/components/auth/AuthButton';
import { CredentialsFields, NameField } from '@/components/auth/AuthFields';
import { AuthHero } from '@/components/auth/AuthHero';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignIn() {
  const { mode: initialMode } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const { form, mode, step, busy, error, info, changeMode, back } = useAuthForm(
    initialMode === 'signUp' ? 'signUp' : 'signIn'
  );
  const nameStep = mode === 'signUp' && step === 2;
  const background = nameStep
    ? 'bg-white'
    : mode === 'signUp'
      ? 'bg-[#A8EF7C]'
      : mode === 'signIn'
        ? 'bg-[#EFA5EF]'
        : 'bg-[#ECE8FF]';

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${background}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="grow items-center overflow-hidden"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-[440px]">
          {nameStep && (
            <>
              <View
                pointerEvents="none"
                className="absolute -top-[100px] -right-[84px] size-[240px] rounded-full bg-[#A8EF7C]"
              />
              <View
                pointerEvents="none"
                className="absolute top-[264px] -left-[48px] size-[116px] rounded-full bg-[#EFA5EF]"
              />
            </>
          )}
          <View className="z-10 flex-row items-center justify-between px-[16px]">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              disabled={busy}
              onPress={back}
              className={`size-[44px] items-center justify-center rounded-full ${nameStep ? 'bg-[#F4F3F7]' : 'bg-white'}`}
            >
              <Ionicons name="chevron-back" size={20} color="#111113" />
            </Pressable>
            {mode === 'signUp' && (
              <Text className="mr-[4px] text-[12px] text-[#62616F]">
                Step {step} of 2
              </Text>
            )}
          </View>
          <AuthHero mode={mode} nameStep={nameStep} />
          <View className="px-[30px]">
            <Text className="mt-[20px] mb-[16px] text-[32px] leading-[36px] font-bold tracking-[-0.5px] text-[#111113]">
              {nameStep
                ? 'Nice to meet you!'
                : mode === 'signUp'
                  ? 'Ready to remember\nmore?'
                  : mode === 'forgot'
                    ? 'Forgot your\npassword?'
                    : 'Hey, you’re back!'}
            </Text>
            {nameStep ? (
              <>
                <Text className="-mt-[8px] mb-[16px] text-[16px] leading-[24px] text-[#62616F]">
                  Ikna will use it to greet you. Optional — you can change it
                  later in Settings.
                </Text>
                <NameField form={form} disabled={busy || !!info} />
              </>
            ) : (
              <>
                {mode === 'forgot' && (
                  <Text className="-mt-[8px] mb-[16px] text-[16px] leading-[24px] text-[#111113]">
                    No worries — enter your email and we’ll send a reset link.
                  </Text>
                )}
                <CredentialsFields
                  form={form}
                  mode={mode}
                  disabled={busy || !!info}
                />
                {mode === 'signIn' && (
                  <Pressable
                    accessibilityRole="button"
                    disabled={busy}
                    onPress={() => changeMode('forgot')}
                    className="min-h-[44px] items-end justify-center"
                  >
                    <Text className="text-[14px] text-[#111113] underline">
                      Forgot password?
                    </Text>
                  </Pressable>
                )}
              </>
            )}
            {error && (
              <Text
                accessibilityRole="alert"
                className="mt-[12px] text-[14px] leading-[20px] text-[#8B1527]"
              >
                {error}
              </Text>
            )}
            {info && (
              <Text
                accessibilityRole="alert"
                className="mt-[12px] text-[14px] leading-[20px] text-[#275E34]"
              >
                {info}
              </Text>
            )}
            <AuthButton
              title={
                nameStep
                  ? 'Create account'
                  : mode === 'signUp'
                    ? 'Continue'
                    : mode === 'forgot'
                      ? 'Send reset link'
                      : 'Log in'
              }
              busy={busy}
              disabled={!!info}
              compact={mode !== 'signUp'}
              onPress={() => void form.handleSubmit()}
            />
            {nameStep && !info ? (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={() => void form.handleSubmit({ skipName: true })}
                className="min-h-[48px] items-center justify-center"
              >
                <Text className="text-[14px] text-[#111113] underline">
                  Skip for now
                </Text>
              </Pressable>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={() =>
                  changeMode(
                    mode === 'signUp' || mode === 'forgot' ? 'signIn' : 'signUp'
                  )
                }
                className="min-h-[48px] items-center justify-center"
              >
                <Text className="text-center text-[14px] text-[#111113]">
                  {mode === 'signUp'
                    ? 'Already have an account? '
                    : mode === 'forgot'
                      ? 'Remembered it? '
                      : 'New here? '}
                  <Text className="underline">
                    {mode === 'signUp' || mode === 'forgot'
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
