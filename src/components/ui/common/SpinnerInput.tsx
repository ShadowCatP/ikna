import { FormInput } from '@/components/forms/FormInput';
import { Button } from '@/components/ui/common/Button';
import { Lucide } from '@/components/ui/icons';
import type { TextInputProps } from 'react-native';

type SpinnerInputProps = Omit<TextInputProps, 'value' | 'onChangeText'> & {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

export function SpinnerInput({
  value,
  onChangeText,
  label,
  min = 0,
  max,
  step = 1,
  disabled = false,
  editable = true,
  accessibilityLabel,
  ...inputProps
}: SpinnerInputProps) {
  const parsedValue = value.trim() ? Number(value) : Number.NaN;
  const isNumericValue = Number.isFinite(parsedValue);
  const isDisabled = disabled || !editable;
  const inputLabel = label ?? accessibilityLabel ?? 'value';

  function adjustValue(direction: -1 | 1) {
    const currentValue = isNumericValue ? parsedValue : min;
    const nextValue = Math.min(
      max ?? Number.POSITIVE_INFINITY,
      Math.max(min, currentValue + direction * step)
    );

    onChangeText(String(nextValue));
  }

  return (
    <FormInput
      {...inputProps}
      label={label}
      value={value}
      onChangeText={onChangeText}
      accessibilityLabel={accessibilityLabel ?? label}
      editable={!isDisabled}
      className="text-center"
      containerClassName="min-h-14 px-1 py-1"
      leftChild={
        <Button
          size="icon"
          variant="surface"
          className="size-10"
          accessibilityLabel={`Decrease ${inputLabel}`}
          disabled={isDisabled || (isNumericValue && parsedValue <= min)}
          onPress={() => adjustValue(-1)}
        >
          <Lucide name="minus" size={20} className="text-foreground" />
        </Button>
      }
      rightChild={
        <Button
          size="icon"
          variant="surface"
          className="size-10"
          accessibilityLabel={`Increase ${inputLabel}`}
          disabled={
            isDisabled ||
            (isNumericValue && max !== undefined && parsedValue >= max)
          }
          onPress={() => adjustValue(1)}
        >
          <Lucide name="plus" size={20} className="text-foreground" />
        </Button>
      }
      textAlign="center"
      keyboardType="number-pad"
    />
  );
}
