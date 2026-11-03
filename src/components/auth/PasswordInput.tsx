import { Ionicons } from '@/components/ui/Ionicons';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <View className="min-h-14 flex-row items-center rounded-2xl bg-white">
      <TextInput
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        secureTextEntry={!visible}
        className="text-foreground flex-1 py-3.5 pl-4 text-base"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible(!visible)}
        className="min-h-14 w-12 items-center justify-center"
      >
        <Ionicons
          name={visible ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          className="text-muted"
        />
      </Pressable>
    </View>
  );
}
