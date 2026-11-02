import { FieldError } from '@/components/forms/FieldError';
import type { AuthFormApi } from '@/hooks/useAuthForm';
import type { AuthMode } from '@/utils/auth-schemas';
import { Text } from 'react-native';
import { AuthInput, PasswordInput } from './AuthInput';

export function CredentialsFields({
  form,
  mode,
  disabled,
}: {
  form: AuthFormApi;
  mode: AuthMode;
  disabled: boolean;
}) {
  return (
    <>
      <form.Field name="email">
        {(field) => (
          <>
            <AuthInput
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
              editable={!disabled}
              returnKeyType={mode === 'forgot' ? 'send' : 'next'}
              onSubmitEditing={
                mode === 'forgot' ? () => void form.handleSubmit() : undefined
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
                  mode === 'signIn' ? 'current-password' : 'new-password'
                }
                textContentType={mode === 'signIn' ? 'password' : 'newPassword'}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                editable={!disabled}
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
    </>
  );
}

export function NameField({
  form,
  disabled,
}: {
  form: AuthFormApi;
  disabled: boolean;
}) {
  return (
    <form.Field name="name">
      {(field) => (
        <>
          <AuthInput
            accessibilityLabel="Your name"
            placeholder="Your name"
            soft
            value={field.state.value}
            onChangeText={field.handleChange}
            onBlur={field.handleBlur}
            maxLength={30}
            autoComplete="given-name"
            textContentType="givenName"
            editable={!disabled}
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
  );
}
