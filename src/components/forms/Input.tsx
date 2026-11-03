import { TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps;

export function Input({ className, ...props }: InputProps) {
  return (
    <View
      className={`bg-background border-border min-h-14 flex-row items-center rounded-2xl border px-2 py-1 ${className ?? ''}`}
    >
      <TextInput
        {...props}
        className="text-foreground flex-1 text-base"
        textAlignVertical="center"
      />
    </View>
  );
}
