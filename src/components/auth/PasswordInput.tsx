import { Input } from '@/components/forms/Input';
import { Lucide } from '@/components/ui/icons';
import { useState } from 'react';
import { Pressable, View, type TextInputProps } from 'react-native';

export function PasswordInput(props: TextInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View className="relative min-h-14 flex-row items-center">
      <Input
        containerClassName="flex-1"
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        secureTextEntry={!isVisible}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isVisible ? 'Hide password' : 'Show password'}
        onPress={() => setIsVisible(!isVisible)}
        className="absolute right-0 min-h-14 w-12 items-center justify-center"
      >
        <Lucide
          name={isVisible ? 'eye' : 'eye-off'}
          size={20}
          className="text-muted"
        />
      </Pressable>
    </View>
  );
}
