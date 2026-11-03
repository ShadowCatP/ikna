import { FieldError } from '@/components/forms/FieldError';
import { Button } from '@/components/ui/Button';
import { verifyRecoveryLink } from '@/utils/auth';
import { resetPasswordSchema } from '@/utils/auth-schemas';
import { errorText } from '@/utils/form';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { useLinkingURL } from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
  const [linkError, setLinkError] = useState<{
    url: string;
    message: string;
  } | null>(null);
  const currentLinkError = linkError?.url === url ? linkError.message : null;

  useEffect(() => {
    if (!url) return;
    let active = true;
    void verifyRecoveryLink(url, supabase.auth)
      .then(() => {
        if (active) {
          setLinkError(null);
          setVerifiedUrl(url);
        }
      })
      .catch(() => {
        if (active)
          setLinkError({
            url,
            message:
              'This reset link is invalid or expired. Please request a new one.',
          });
      });
    return () => {
      active = false;
    };
  }, [url]);

  const form = useForm({
    defaultValues: { password: '', confirm: '' },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value, formApi }) => {
      if (!ready) return;
      formApi.setErrorMap({ onSubmit: undefined });
      try {
        const { error: authError } = await supabase.auth.updateUser({
          password: value.password,
        });
        if (authError)
          formApi.setErrorMap({
            onSubmit: { form: authError.message, fields: {} },
          });
        else {
          formApi.reset();
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

  return (
    <KeyboardAvoidingView
      className="bg-primary-soft flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="grow items-center justify-center"
        contentContainerStyle={{
          paddingTop: insets.top + 48,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="w-full max-w-md px-8">
          <Text className="text-foreground mb-3 text-2xl leading-10 font-bold">
            Choose a new password
          </Text>
          <Text className="text-muted mb-6 text-base">
            Use at least 8 characters.
          </Text>
          {!url && (
            <Text className="text-danger my-3">
              Open the password reset link from your email to continue.
            </Text>
          )}
          {!!url && !ready && !currentLinkError && (
            <ActivityIndicator className="text-primary" />
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(busy) => (
              <>
                <form.Field name="password">
                  {(field) => (
                    <>
                      <TextInput
                        className="bg-background text-foreground placeholder:text-muted mb-3 min-h-14 rounded-2xl px-4 py-3.5 text-base"
                        accessibilityLabel="New password"
                        placeholder="New password"
                        secureTextEntry
                        autoCapitalize="none"
                        autoComplete="new-password"
                        textContentType="newPassword"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        editable={ready && !busy}
                      />
                      <FieldError meta={field.state.meta} />
                    </>
                  )}
                </form.Field>
                <form.Field name="confirm">
                  {(field) => (
                    <>
                      <TextInput
                        className="bg-background text-foreground placeholder:text-muted mb-3 min-h-14 rounded-2xl px-4 py-3.5 text-base"
                        accessibilityLabel="Confirm password"
                        placeholder="Confirm password"
                        secureTextEntry
                        autoCapitalize="none"
                        textContentType="newPassword"
                        value={field.state.value}
                        onChangeText={field.handleChange}
                        onBlur={field.handleBlur}
                        editable={ready && !busy}
                        onSubmitEditing={() => void form.handleSubmit()}
                      />
                      <FieldError meta={field.state.meta} />
                    </>
                  )}
                </form.Field>
                {currentLinkError && (
                  <Text accessibilityRole="alert" className="text-danger my-3">
                    {currentLinkError}
                  </Text>
                )}
                <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
                  {(submitError) => {
                    const message = errorText([submitError]);
                    return message ? (
                      <Text
                        accessibilityRole="alert"
                        className="text-danger my-3"
                      >
                        {message}
                      </Text>
                    ) : null;
                  }}
                </form.Subscribe>
                <View className="mt-7">
                  <Button
                    disabled={!ready || busy}
                    onPress={() => void form.handleSubmit()}
                  >
                    {busy ? (
                      <ActivityIndicator className="text-background" />
                    ) : (
                      <Text className="text-background text-base font-medium">
                        Save password
                      </Text>
                    )}
                  </Button>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => router.replace('/sign-in')}
                  className="min-h-12 items-center justify-center"
                >
                  <Text className="text-foreground underline">
                    Back to log in
                  </Text>
                </Pressable>
              </>
            )}
          </form.Subscribe>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
