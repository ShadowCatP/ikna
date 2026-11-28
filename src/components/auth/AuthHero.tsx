import type { AuthMode } from '@/utils/auth-schemas';
import { Image, View } from 'react-native';

export function AuthHero({
  mode,
  isNameStep,
}: {
  mode: AuthMode;
  isNameStep: boolean;
}) {
  const darkCircle =
    mode === 'signUp'
      ? 'bg-accent-container'
      : mode === 'signIn'
        ? 'bg-accent-secondary'
        : 'bg-primary-soft';

  return (
    <View
      pointerEvents="none"
      className={
        isNameStep ? 'mt-3 h-72 items-center' : '-mt-11 h-56 items-center'
      }
    >
      {!isNameStep && (
        <View
          className={`absolute bottom-5 hidden size-[460px] rounded-full dark:flex ${darkCircle}`}
        />
      )}
      <Image
        source={
          isNameStep
            ? require('@/assets/images/ikna-happy.png')
            : mode === 'forgot'
              ? require('@/assets/images/ikna-thinking.png')
              : mode === 'signIn'
                ? require('@/assets/images/ikna-waving.png')
                : require('@/assets/images/ikna-excited.png')
        }
        className={
          isNameStep ? 'absolute bottom-4 left-[18%] h-52 w-48' : 'h-56 w-56'
        }
        resizeMode="contain"
        accessible={false}
      />
      {isNameStep && (
        <Image
          source={require('@/assets/images/ikna-speech-bubble.png')}
          className="absolute top-4 right-[11%] h-24 w-32"
          resizeMode="contain"
          accessibilityLabel="Hi! I'm Ikna. What should I call you?"
        />
      )}
    </View>
  );
}
