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
        <View className="px-8">
          <Text className="text-foreground mt-5 mb-4 text-2xl leading-9 font-bold tracking-tight">
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
              <Text className="text-muted -mt-2 mb-4 text-base leading-6">
                Ikna will use it to greet you. Optional. You can change it later
                in Settings.
              </Text>
              <form.Field name="name">
                {(field) => (
                  <>
                    <TextInput
                      className="bg-surface text-foreground placeholder:text-muted mb-3 min-h-14 rounded-2xl px-4 py-3.5 text-base"
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
                    <Text className="text-muted -mt-1 text-right text-xs">
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
                <Text className="text-foreground -mt-2 mb-4 text-base leading-6">
                  {"No worries. Enter your email and we'll send a reset link."}
                </Text>
              )}
              <form.Field name="email">
                {(field) => (
                  <>
                    <TextInput
                      className="bg-background text-foreground placeholder:text-muted mb-3 min-h-14 rounded-2xl px-4 py-3.5 text-base"
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
                <Text className="text-foreground mt-2 text-xs">
                  At least 8 characters
                </Text>
              )}
              {mode === 'signIn' && (
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => changeMode('forgot')}
                  className="min-h-11 items-end justify-center"
                >
                  <Text className="text-foreground text-sm underline">
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
                  className="text-danger mt-3 text-sm leading-5"
                >
                  {message}
                </Text>
              ) : null;
            }}
          </form.Subscribe>
          {info && (
            <Text
              accessibilityRole="text"
              className="text-success mt-3 text-sm leading-5"
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
              className="min-h-12 items-center justify-center"
            >
              <Text className="text-foreground text-sm underline">
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
              className="min-h-12 items-center justify-center"
            >
              <Text className="text-foreground text-center text-sm">
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
