import {
  getAuthSchema,
  type AuthMode,
  type AuthStep,
} from '@/utils/auth-schemas';
import { supabase } from '@/utils/supabase';
import { useForm, useStore } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';

export function useAuthForm(initialMode: AuthMode) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>(1);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { email: '', password: '', name: '' },
    onSubmitMeta: { skipName: false },
    validators: { onSubmit: getAuthSchema(mode, step) },
    onSubmit: async ({ value, meta }) => {
      if (info) return;
      setError(null);
      if (mode === 'signUp' && step === 1) {
        setStep(2);
        return;
      }
      try {
        const email = value.email.trim();
        if (mode === 'forgot') {
          const { error: authError } =
            await supabase.auth.resetPasswordForEmail(email, {
              redirectTo: 'ikna://reset-password',
            });
          if (authError) setError(authError.message);
          else
            setInfo(
              'If an account exists for this email, you’ll receive a reset link.'
            );
        } else if (mode === 'signIn') {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: value.password,
          });
          if (authError) setError(authError.message);
          else router.replace('/home');
        } else {
          const displayName = meta.skipName ? '' : value.name.trim();
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: value.password,
            options: { data: displayName ? { display_name: displayName } : {} },
          });
          if (authError) setError(authError.message);
          else if (data.session) router.replace('/home');
          else {
            form.setFieldValue('password', '');
            setInfo(
              'Check your email to confirm your account. Then log in to continue.'
            );
          }
        }
      } catch {
        setError('Could not connect. Please try again.');
      }
    },
  });
  const busy = useStore(form.store, (state) => state.isSubmitting);

  function changeMode(nextMode: AuthMode) {
    if (busy) return;
    form.reset(form.state.values);
    setMode(nextMode);
    setStep(1);
    setError(null);
    setInfo(null);
  }

  function back() {
    if (busy) return;
    if (mode === 'signUp' && step === 2 && !info) {
      setStep(1);
      setError(null);
    } else if (mode === 'forgot') changeMode('signIn');
    else router.replace('/welcome');
  }

  return { form, mode, step, busy, error, info, changeMode, back };
}

export type AuthFormApi = ReturnType<typeof useAuthForm>['form'];
