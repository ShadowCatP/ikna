import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Index() {
  const resetSession = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    router.replace('/sign-in');
  };

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Pressable
        onPress={resetSession}
        className="rounded-lg bg-black px-4 py-3"
      >
        <Text className="text-white">Go to sign in</Text>
      </Pressable>
    </View>
  );
}
