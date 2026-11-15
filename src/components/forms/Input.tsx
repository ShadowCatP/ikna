import { FieldError } from '@/components/forms/FieldError';
import { Label } from '@/components/forms/Label';
import { cn } from '@/utils/cn';
import { errorText } from '@/utils/form';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type InputProps = TextInputProps & {
  label?: string;
  containerClassName?: string;
  error?: {
    isTouched: boolean;
    errors: readonly unknown[];
  };
  maxCharacterLimit?: number;
};

export function Input({
  className,
  containerClassName,
  error,
  label,
  maxCharacterLimit,
  style,
  value,
  ...props
}: InputProps) {
  const hasError = Boolean(
    error?.isTouched && errorText(error.errors) !== undefined
  );

  return (
    <View className={cn(label && 'gap-2', containerClassName)}>
      {label && <Label>{label}</Label>}
      <View
        className={cn(
          'bg-background border-border min-h-14 flex-row items-center rounded-2xl border px-2 py-1',
          className
        )}
      >
        <TextInput
          {...props}
          value={value}
          className="text-foreground flex-1"
          style={[style, { alignSelf: 'stretch' }]}
          textAlignVertical={props.textAlignVertical ?? 'center'}
        />
      </View>
      {(hasError || maxCharacterLimit !== undefined) && (
        <View className="min-h-6 flex-row items-center justify-between">
          <View className="flex-1">{error && <FieldError meta={error} />}</View>
          {maxCharacterLimit !== undefined && (
            <Text className="text-muted shrink-0 text-xs">
              {typeof value === 'string' ? value.length : 0} /{' '}
              {maxCharacterLimit}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
