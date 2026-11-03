import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { getAuthSchema, type AuthStep } from '@/utils/auth-schemas';
import { errorText } from '@/utils/form';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function SignUp() {
  const [step, setStep] = useState<AuthStep>(1);
  const [info, setInfo] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { email: '', password: '', name: '' },
    validators: { onSubmit: getAuthSchema('signUp', step) },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({ onSubmit: undefined });
      if (step === 1) {
        setStep(2);
        return;
      }
      try {
        const displayName = value.name.trim();
        const { data, error } = await supabase.auth.signUp({
          email: value.email.trim(),
          password: value.password,
          options: { data: displayName ? { display_name: displayName } : {} },
        });
        if (error) {
          formApi.setErrorMap({
            onSubmit: { form: error.message, fields: {} },
          });
        } else if (data.session) {
          router.replace('/home');
        } else {
          formApi.setFieldValue('password', '');
          setInfo(
            'Check your email to confirm your account. Then log in to continue.'
          );
        }
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: 'Could not connect. Please try again.',
            fields: {},
          },
        });
      }
    },
  });
  const nameStep = step === 2;

  function goBack() {
    if (form.state.isSubmitting) return;
    if (nameStep && !info) {
      setStep(1);
      form.setErrorMap({ onSubmit: undefined });
    } else {
      router.push('/welcome');
    }
  }

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(busy) => (
        <AuthScreen
          mode="signUp"
          nameStep={nameStep}
          step={step}
          busy={busy}
          onBack={goBack}
        >
          <View className="px-8">
            <Text className="text-foreground mt-5 mb-4 text-2xl leading-9 font-bold tracking-tight">
              {nameStep ? 'Nice to meet you!' : 'Ready to remember more?'}
            </Text>
            {nameStep ? (
              <>
                <Text className="text-muted -mt-2 mb-4 text-base leading-6">
                  Ikna will use it to greet you. Optional. You can change it
                  later in Settings.
                </Text>
                <form.Field name="name">
                  {(field) => (
                    <>
                      <Input
                        className="bg-surface"
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
              <View className="gap-3">
                <form.Field name="email">
                  {(field) => (
                    <>
                      <Input
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
                        returnKeyType="next"
                      />
                      <FieldError meta={field.state.meta} />
                    </>
                  )}
                </form.Field>
                <form.Field name="password">
                  {(field) => (
                    <>
                      <PasswordInput
                        accessibilityLabel="Password"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        editable={!busy && !info}
                        returnKeyType="go"
                        onSubmitEditing={() => void form.handleSubmit()}
                      />
                      <FieldError meta={field.state.meta} />
                      <Text className="text-foreground text-xs">
                        At least 8 characters
                      </Text>
                    </>
                  )}
                </form.Field>
              </View>
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
            <View className="mt-4">
              <Button
                disabled={busy || !!info}
                onPress={() => void form.handleSubmit()}
              >
                {busy ? (
                  <ActivityIndicator className="text-background" />
                ) : (
                  <Text className="text-background text-base font-medium">
                    {nameStep ? 'Create account' : 'Continue'}
                  </Text>
                )}
              </Button>
            </View>
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
            ) : !nameStep ? (
              <Pressable
                accessibilityRole="button"
                disabled={busy}
                onPress={() => router.push('/sign-in')}
                className="min-h-12 items-center justify-center"
              >
                <Text className="text-foreground text-center text-sm">
                  Already have an account?{' '}
                  <Text className="underline">Log in</Text>
                </Text>
              </Pressable>
            ) : null}
          </View>
        </AuthScreen>
      )}
    </form.Subscribe>
  );
}
