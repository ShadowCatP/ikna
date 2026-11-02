import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';

export function AuthInput({
  soft = false,
  ...props
}: TextInputProps & { soft?: boolean }) {
  return (
    <TextInput
      placeholderTextColor="#62616F"
      {...props}
      className={`mb-[12px] min-h-[54px] rounded-[16px] px-[16px] py-[14px] text-[16px] text-[#111113] ${soft ? 'bg-[#F4F3F7]' : 'bg-white'}`}
    />
  );
}

export function PasswordInput(props: TextInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <View className="min-h-[54px] flex-row items-center rounded-[16px] bg-white">
      <TextInput
        placeholder="Password"
        placeholderTextColor="#62616F"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        secureTextEntry={!visible}
        className="flex-1 py-[14px] pl-[16px] text-[16px] text-[#111113]"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Hide password' : 'Show password'}
        onPress={() => setVisible(!visible)}
        className="min-h-[54px] w-[48px] items-center justify-center"
      >
        <Ionicons
          name={visible ? 'eye-outline' : 'eye-off-outline'}
          size={20}
          color="#62616F"
        />
      </Pressable>
    </View>
  );
}
