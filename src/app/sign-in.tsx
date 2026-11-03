import { AuthForm } from '@/components/auth/AuthForm';
import { AuthHero } from '@/components/auth/AuthHero';
import { useAuthForm } from '@/hooks/useAuthForm';
import { Ionicons } from '@react-native-vector-icons/ionicons';
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
    ? 'bg-white'
    : mode === 'signUp'
      ? 'bg-[#A8EF7C]'
      : mode === 'signIn'
        ? 'bg-[#EFA5EF]'
        : 'bg-[#ECE8FF]';

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
        <View className="w-full max-w-[440px]">
          {nameStep && (
            <>
              <View
                pointerEvents="none"
                className="absolute -top-[100px] -right-[84px] size-[240px] rounded-full bg-[#A8EF7C]"
              />
              <View
                pointerEvents="none"
                className="absolute top-[264px] -left-[48px] size-[116px] rounded-full bg-[#EFA5EF]"
              />
            </>
          )}
          <View className="z-10 flex-row items-center justify-between px-[16px]">
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(busy) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Go back"
                  disabled={busy}
                  onPress={back}
                  className={`size-[44px] items-center justify-center rounded-full ${nameStep ? 'bg-[#F4F3F7]' : 'bg-white'}`}
                >
                  <Ionicons name="chevron-back" size={20} color="#111113" />
                </Pressable>
              )}
            </form.Subscribe>
            {mode === 'signUp' && (
              <Text className="mr-[4px] text-[12px] text-[#62616F]">
                Step {step} of 2
              </Text>
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
