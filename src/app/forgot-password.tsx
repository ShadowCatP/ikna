import { AuthScreen } from '@/components/auth/AuthScreen';
import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/Button';
import { getAuthSchema } from '@/utils/auth-schemas';
import { errorText } from '@/utils/form';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function ForgotPassword() {
  const [info, setInfo] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { email: '', password: '', name: '' },
    validators: { onSubmit: getAuthSchema('forgot', 1) },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({ onSubmit: undefined });
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(
          value.email.trim(),
          { redirectTo: 'ikna://reset-password' }
        );
        if (error) {
          formApi.setErrorMap({
            onSubmit: { form: error.message, fields: {} },
          });
        } else {
          setInfo(
            "If an account exists for this email, you'll receive a reset link."
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

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(busy) => (
        <AuthScreen
          mode="forgot"
          busy={busy}
          onBack={() => {
            if (!busy) router.back();
          }}
        >
          <View className="px-8">
            <Text className="text-foreground mt-5 mb-4 text-2xl leading-9 font-bold tracking-tight">
              Forgot your password?
            </Text>
            <Text className="text-foreground -mt-2 mb-4 text-base leading-6">
              No worries. Enter your email and we'll send a reset link.
            </Text>
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
                    returnKeyType="send"
                    onSubmitEditing={() => void form.handleSubmit()}
                  />
                  <FieldError meta={field.state.meta} />
                </>
              )}
            </form.Field>
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
                    Send reset link
                  </Text>
                )}
              </Button>
            </View>
          </View>
        </AuthScreen>
      )}
    </form.Subscribe>
  );
}
