import { Input } from '@/components/forms/input';
import { Ionicons } from '@/components/ui/Ionicons';
import { useState } from 'react';
import { Pressable, View, type TextInputProps } from 'react-native';

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <View className="relative min-h-14 flex-row items-center">
      <Input
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        secureTextEntry={!visible}
        className="flex-1"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible(!visible)}
        className="absolute right-0 min-h-14 w-12 items-center justify-center"
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
