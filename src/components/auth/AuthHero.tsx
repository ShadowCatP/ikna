import type { AuthMode } from '@/utils/auth-schemas';
import { Image, View } from 'react-native';

export function AuthHero({
  mode,
  nameStep,
}: {
  mode: AuthMode;
  nameStep: boolean;
}) {
  return (
    <View
      pointerEvents="none"
      className={
        nameStep ? 'mt-3 h-72 items-center' : '-mt-11 h-56 items-center'
      }
    >
      <Image
        source={
          nameStep
            ? require('@/assets/images/ikna-happy.png')
            : mode === 'forgot'
              ? require('@/assets/images/ikna-thinking.png')
              : mode === 'signIn'
                ? require('@/assets/images/ikna-waving.png')
                : require('@/assets/images/ikna-excited.png')
        }
        className={
          nameStep ? 'absolute bottom-4 left-[18%] h-52 w-48' : 'h-56 w-56'
        }
        resizeMode="contain"
        accessible={false}
      />
      {nameStep && (
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
