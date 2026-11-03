import {
  getAuthSchema,
  type AuthMode,
  type AuthStep,
} from '@/utils/auth-schemas';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useState } from 'react';

export function useAuthForm(initialMode: AuthMode) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>(1);
  const [info, setInfo] = useState<string | null>(null);
  const form = useForm({
    defaultValues: { email: '', password: '', name: '' },
    onSubmitMeta: { skipName: false },
    validators: { onSubmit: getAuthSchema(mode, step) },
    onSubmit: async ({ value, meta, formApi }) => {
      if (info) return;
      formApi.setErrorMap({ onSubmit: undefined });
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
          if (authError)
            formApi.setErrorMap({
              onSubmit: { form: authError.message, fields: {} },
            });
          else
            setInfo(
              "If an account exists for this email, you'll receive a reset link."
            );
        } else if (mode === 'signIn') {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password: value.password,
          });
          if (authError)
            formApi.setErrorMap({
              onSubmit: { form: authError.message, fields: {} },
            });
          else router.replace('/home');
        } else {
          const displayName = meta.skipName ? '' : value.name.trim();
          const { data, error: authError } = await supabase.auth.signUp({
            email,
            password: value.password,
            options: { data: displayName ? { display_name: displayName } : {} },
          });
          if (authError)
            formApi.setErrorMap({
              onSubmit: { form: authError.message, fields: {} },
            });
          else if (data.session) router.replace('/home');
          else {
            formApi.setFieldValue('password', '');
            setInfo(
              'Check your email to confirm your account. Then log in to continue.'
            );
          }
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

  function changeMode(nextMode: AuthMode) {
    if (form.state.isSubmitting) return;
    form.reset(form.state.values);
    setMode(nextMode);
    setStep(1);
    setInfo(null);
  }

  function back() {
    if (form.state.isSubmitting) return;
    if (mode === 'signUp' && step === 2 && !info) {
      setStep(1);
      form.setErrorMap({ onSubmit: undefined });
    } else if (mode === 'forgot') changeMode('signIn');
    else router.replace('/welcome');
  }

  return { form, mode, step, info, changeMode, back };
}
