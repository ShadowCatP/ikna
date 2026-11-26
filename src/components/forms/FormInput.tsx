import { FieldError } from '@/components/forms/FieldError';
import { Input, type InputProps } from '@/components/forms/Input';
import { Label } from '@/components/forms/Label';
import { cn } from '@/utils/cn';
import { errorText } from '@/utils/form';
import { Text, View } from 'react-native';

type FormInputProps = InputProps & {
  label?: string;
  error?: {
    isTouched: boolean;
    errors: readonly unknown[];
  };
  maxCharacterLimit?: number;
};

export function FormInput({
  label,
  containerClassName,
  error,
  maxCharacterLimit,
  value,
  ...inputProps
}: FormInputProps) {
  const hasError = Boolean(
    error?.isTouched && errorText(error.errors) !== undefined
  );

  return (
    <View className={cn(label && 'gap-2')}>
      {label && <Label>{label}</Label>}
      <Input
        {...inputProps}
        value={value}
        containerClassName={containerClassName}
      />
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
