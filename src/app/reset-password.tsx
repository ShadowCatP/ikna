import { AuthButton } from '@/components/auth/AuthButton';
import { FieldError } from '@/components/forms/FieldError';
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
      className="flex-1 bg-[#ECE8FF]"
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
        <View className="w-full max-w-[440px] px-[30px]">
          <Text className="mb-[12px] text-[32px] leading-[38px] font-bold text-[#111113]">
            Choose a new password
          </Text>
          <Text className="mb-[24px] text-[16px] text-[#62616F]">
            Use at least 8 characters.
          </Text>
          {!url && (
            <Text className="my-[12px] text-[#8B1527]">
              Open the password reset link from your email to continue.
            </Text>
          )}
          {!!url && !ready && !currentLinkError && (
            <ActivityIndicator color="#6C52FF" />
          )}
          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(busy) => (
              <>
                <form.Field name="password">
                  {(field) => (
                    <>
                      <TextInput
                        placeholderTextColor="#62616F"
                        className="mb-[12px] min-h-[54px] rounded-[16px] bg-white px-[16px] py-[14px] text-[16px] text-[#111113]"
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
                        placeholderTextColor="#62616F"
                        className="mb-[12px] min-h-[54px] rounded-[16px] bg-white px-[16px] py-[14px] text-[16px] text-[#111113]"
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
                  <Text
                    accessibilityRole="alert"
                    className="my-[12px] text-[#8B1527]"
                  >
                    {currentLinkError}
                  </Text>
                )}
                <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
                  {(submitError) => {
                    const message = errorText([submitError]);
                    return message ? (
                      <Text
                        accessibilityRole="alert"
                        className="my-[12px] text-[#8B1527]"
                      >
                        {message}
                      </Text>
                    ) : null;
                  }}
                </form.Subscribe>
                <AuthButton
                  title="Save password"
                  disabled={!ready}
                  busy={busy}
                  onPress={() => void form.handleSubmit()}
                />
                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => router.replace('/sign-in')}
                  className="min-h-[48px] items-center justify-center"
                >
                  <Text className="text-[#111113] underline">
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
