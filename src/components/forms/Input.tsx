import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

export type InputProps = TextInputProps & {
  containerClassName?: string;
  leftChild?: ReactNode;
  rightChild?: ReactNode;
};

export function Input({
  className,
  containerClassName,
  leftChild,
  rightChild,
  style,
  value,
  ...props
}: InputProps) {
  return (
    <View
      className={cn(
        'bg-field border-field-border flex-row items-center rounded-2xl border px-2 py-1',
        containerClassName
      )}
    >
      {leftChild}
      <TextInput
        {...props}
        value={value}
        className={cn(
          'text-foreground placeholder:text-muted flex-1',
          className
        )}
        style={[style, { alignSelf: 'stretch' }]}
        textAlignVertical={props.textAlignVertical ?? 'center'}
      />
      {rightChild}
    </View>
  );
}
