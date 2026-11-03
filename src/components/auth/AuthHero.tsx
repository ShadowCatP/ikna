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
        nameStep
          ? 'mt-[12px] h-[300px] items-center'
          : '-mt-[44px] h-[220px] items-center'
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
          nameStep
            ? 'absolute bottom-[16px] left-[18%] h-[210px] w-[190px]'
            : 'h-[220px] w-[220px]'
        }
        resizeMode="contain"
        accessible={false}
      />
      {nameStep && (
        <Image
          source={require('@/assets/images/ikna-speech-bubble.png')}
          className="absolute top-[16px] right-[11%] h-[94px] w-[132px]"
          resizeMode="contain"
          accessibilityLabel="Hi! I'm Ikna. What should I call you?"
        />
      )}
    </View>
  );
}
