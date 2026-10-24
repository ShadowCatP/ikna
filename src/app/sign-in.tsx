import { FieldError } from '@/components/forms/FieldError';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { z } from 'zod';

const authSchema = z.object({
  email: z.email('Email not valid'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default function Index() {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onChange: authSchema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setInfo(null);

      if (mode === 'signIn') {
        const { error } = await supabase.auth.signInWithPassword(value);
        if (error) setServerError(error.message);
      } else {
        const { data, error } = await supabase.auth.signUp(value);
        if (error) setServerError(error.message);
        else if (!data.session)
          setInfo('Check your email to confirm your account.');
      }
    },
  });

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <View className="flex-1 justify-center gap-4 px-6">
        <Text className="text-3xl font-bold">
          {mode === 'signIn' ? 'Welcome back' : 'Create account'}
        </Text>

        <form.Field name="email">
          {(field) => (
            <View className="gap-1">
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
              />
              <FieldError meta={field.state.meta} />
            </View>
          )}
        </form.Field>

        <form.Field name="password">
          {(field) => (
            <View className="gap-1">
              <TextInput
                className="rounded-lg border border-gray-300 px-4 py-3"
                placeholder="Password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete={
                  mode === 'signIn' ? 'current-password' : 'new-password'
                }
                textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={field.handleChange}
                onSubmitEditing={form.handleSubmit}
              />
              <FieldError meta={field.state.meta} />
            </View>
          )}
        </form.Field>

        {serverError && <Text className="text-red-600">{serverError}</Text>}
        {info && <Text className="text-green-700">{info}</Text>}

        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Pressable
              onPress={form.handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={`items-center rounded-lg bg-black py-3 ${
                !canSubmit || isSubmitting ? 'opacity-50' : ''
              }`}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white">
                  {mode === 'signIn' ? 'Sign in' : 'Sign up'}
                </Text>
              )}
            </Pressable>
          )}
        </form.Subscribe>

        <Pressable
          onPress={() => {
            setMode(mode === 'signIn' ? 'signUp' : 'signIn');
            setServerError(null);
            setInfo(null);
          }}
        >
          <Text className="text-center text-gray-600">
            {mode === 'signIn'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
