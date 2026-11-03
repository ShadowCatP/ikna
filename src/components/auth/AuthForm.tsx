import { FieldError } from '@/components/forms/FieldError';
import type { useAuthForm } from '@/hooks/useAuthForm';
import { errorText } from '@/utils/form';
import { Pressable, Text, TextInput, View } from 'react-native';
import { AuthButton } from './AuthButton';
import { PasswordInput } from './PasswordInput';

export function AuthForm({
  form,
  mode,
  step,
  info,
  changeMode,
}: Omit<ReturnType<typeof useAuthForm>, 'back'>) {
  const nameStep = mode === 'signUp' && step === 2;

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(busy) => (
        <View className="px-[30px]">
          <Text className="mt-[20px] mb-[16px] text-[32px] leading-[36px] font-bold tracking-[-0.5px] text-[#111113]">
            {nameStep
              ? 'Nice to meet you!'
              : mode === 'signUp'
                ? 'Ready to remember\nmore?'
                : mode === 'forgot'
                  ? 'Forgot your\npassword?'
                  : "Hey, you're back!"}
          </Text>
          {nameStep ? (
            <>
              <Text className="-mt-[8px] mb-[16px] text-[16px] leading-[24px] text-[#62616F]">
                Ikna will use it to greet you. Optional. You can change it later
                in Settings.
              </Text>
              <form.Field name="name">
                {(field) => (
                  <>
                    <TextInput
                      placeholderTextColor="#62616F"
                      className="mb-[12px] min-h-[54px] rounded-[16px] bg-[#F4F3F7] px-[16px] py-[14px] text-[16px] text-[#111113]"
                      accessibilityLabel="Your name"
                      placeholder="Your name"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      maxLength={30}
                      autoComplete="given-name"
                      textContentType="givenName"
                      editable={!busy && !info}
                      returnKeyType="done"
                      onSubmitEditing={() => void form.handleSubmit()}
                    />
                    <Text className="-mt-[4px] text-right text-[12px] text-[#62616F]">
                      {field.state.value.length} / 30
                    </Text>
                    <FieldError meta={field.state.meta} />
                  </>
                )}
              </form.Field>
            </>
          ) : (
            <>
              {mode === 'forgot' && (
                <Text className="-mt-[8px] mb-[16px] text-[16px] leading-[24px] text-[#111113]">
                  {"No worries. Enter your email and we'll send a reset link."}
                </Text>
              )}
              <form.Field name="email">
                {(field) => (
                  <>
                    <TextInput
                      placeholderTextColor="#62616F"
                      className="mb-[12px] min-h-[54px] rounded-[16px] bg-white px-[16px] py-[14px] text-[16px] text-[#111113]"
                      accessibilityLabel="Email"
                      placeholder="Email"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      editable={!busy && !info}
                      returnKeyType={mode === 'forgot' ? 'send' : 'next'}
                      onSubmitEditing={
                        mode === 'forgot'
                          ? () => void form.handleSubmit()
                          : undefined
                      }
                    />
                    <FieldError meta={field.state.meta} />
                  </>
                )}
              </form.Field>
              {mode !== 'forgot' && (
                <form.Field name="password">
                  {(field) => (
                    <>
                      <PasswordInput
                        accessibilityLabel="Password"
                        autoComplete={
                          mode === 'signIn'
                            ? 'current-password'
                            : 'new-password'
                        }
                        textContentType={
                          mode === 'signIn' ? 'password' : 'newPassword'
                        }
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        editable={!busy && !info}
                        returnKeyType="go"
                        onSubmitEditing={() => void form.handleSubmit()}
                      />
                      <FieldError meta={field.state.meta} />
                    </>
                  )}
                </form.Field>
              )}
              {mode === 'signUp' && (
                <Text className="mt-[8px] text-[12px] text-[#111113]">
                  At least 8 characters
                </Text>
              )}
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
          <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
            {(submitError) => {
              const message = errorText([submitError]);
              return message ? (
                <Text
                  accessibilityRole="alert"
                  className="mt-[12px] text-[14px] leading-[20px] text-[#8B1527]"
                >
                  {message}
                </Text>
              ) : null;
            }}
          </form.Subscribe>
          {info && (
            <Text
              accessibilityRole="text"
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
      )}
    </form.Subscribe>
  );
}
