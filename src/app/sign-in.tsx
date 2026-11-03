import { AuthForm } from '@/components/auth/AuthForm';
import { AuthHero } from '@/components/auth/AuthHero';
import { Ionicons } from '@/components/ui/Ionicons';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useLocalSearchParams } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SignIn() {
  const { mode: initialMode } = useLocalSearchParams<{ mode?: string }>();
  const insets = useSafeAreaInsets();
  const { form, mode, step, info, changeMode, back } = useAuthForm(
    initialMode === 'signUp' ? 'signUp' : 'signIn'
  );
  const nameStep = mode === 'signUp' && step === 2;
  const background = nameStep
    ? 'bg-background'
    : mode === 'signUp'
      ? 'bg-accent'
      : mode === 'signIn'
        ? 'bg-accent-secondary'
        : 'bg-primary-soft';

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${background}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="grow items-center overflow-hidden"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full max-w-md">
          {nameStep && (
            <>
              <View
                pointerEvents="none"
                className="bg-accent absolute -top-24 -right-20 size-60 rounded-full"
              />
              <View
                pointerEvents="none"
                className="bg-accent-secondary absolute top-64 -left-12 size-28 rounded-full"
              />
            </>
          )}
          <View className="z-10 flex-row items-center justify-between px-4">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(busy) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  disabled={busy}
                  onPress={back}
                  className={`size-11 items-center justify-center rounded-full ${nameStep ? 'bg-surface' : 'bg-background'}`}
                >
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    className="text-foreground"
                  />
                </Pressable>
              )}
            </form.Subscribe>
            {mode === 'signUp' && (
              <Text className="text-muted mr-1 text-xs">Step {step} of 2</Text>
            )}
          </View>
          <AuthHero mode={mode} nameStep={nameStep} />
          <AuthForm
            form={form}
            mode={mode}
            step={step}
            info={info}
            changeMode={changeMode}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
