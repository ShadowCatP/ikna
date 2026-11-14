import { cn } from '@/utils/cn';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
};

export function Input({ className, label, style, ...props }: InputProps) {
  return (
    <View className={cn(label && 'gap-2')}>
      {label && (
        <Text className="text-muted text-xs font-medium tracking-wide uppercase">
          {label}
        </Text>
      )}
      <View
        className={cn(
          'bg-background border-border min-h-14 flex-row items-center rounded-2xl border px-2 py-1',
          className
        )}
      >
        <TextInput
          {...props}
          className="text-foreground flex-1"
          style={[style, { alignSelf: 'stretch' }]}
          textAlignVertical="center"
        />
      </View>
    </View>
  );
}
