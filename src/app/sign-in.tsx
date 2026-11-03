import { AuthScreen } from '@/components/auth/AuthScreen';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { getAuthSchema } from '@/utils/auth-schemas';
import { errorText } from '@/utils/form';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

export default function SignIn() {
  const form = useForm({
    defaultValues: { email: '', password: '', name: '' },
    validators: { onSubmit: getAuthSchema('signIn', 1) },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({ onSubmit: undefined });
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: value.email.trim(),
          password: value.password,
        });
        if (error) {
          formApi.setErrorMap({
            onSubmit: { form: error.message, fields: {} },
          });
        } else {
          router.replace('/home');
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

  function goBack() {
    if (!form.state.isSubmitting) router.replace('/welcome');
  }

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(busy) => (
        <AuthScreen mode="signIn" busy={busy} onBack={goBack}>
          <View className="px-8">
            <Text className="text-foreground mt-5 mb-4 text-2xl leading-9 font-bold tracking-tight">
              {"Hey, you're back!"}
            </Text>
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
                      editable={!busy}
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
                      autoComplete="current-password"
                      textContentType="password"
                      value={field.state.value}
                      onChangeText={field.handleChange}
                      onBlur={field.handleBlur}
                      editable={!busy}
                      returnKeyType="go"
                      onSubmitEditing={() => void form.handleSubmit()}
                    />
                    <FieldError meta={field.state.meta} />
                  </>
                )}
              </form.Field>
            </View>
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
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => router.push('/forgot-password')}
              className="my-4 items-end justify-center"
            >
              <Text className="text-foreground text-sm underline">
                Forgot password?
              </Text>
            </Pressable>
            <View className="">
              <Button disabled={busy} onPress={() => void form.handleSubmit()}>
                {busy ? (
                  <ActivityIndicator className="text-background" />
                ) : (
                  <Text className="text-background text-base font-medium">
                    Log in
                  </Text>
                )}
              </Button>
            </View>
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={() => router.push('/sign-up')}
              className="min-h-12 items-center justify-center"
            >
              <Text className="text-foreground text-center text-sm">
                New here? <Text className="underline">Create account</Text>
              </Text>
            </Pressable>
          </View>
        </AuthScreen>
      )}
    </form.Subscribe>
  );
}
