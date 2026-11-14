import { cn } from '@/utils/cn';
import { Pressable, type PressableProps } from 'react-native';

const buttonBaseClasses =
  'min-h-14 items-center justify-center rounded-2xl px-4 py-3.5 active:opacity-60';

const buttonVariantClasses = {
  default: 'bg-foreground',
  destructive: 'bg-danger',
} as const;

type ButtonProps = PressableProps & {
  className?: string;
  variant?: 'default' | 'destructive';
};

export function Button({
  className,
  children,
  disabled,
  variant = 'default',
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      className={cn(
        buttonBaseClasses,
        buttonVariantClasses[variant],
        disabled && 'opacity-60',
        className
      )}
    >
      {children}
    </Pressable>
  );
}
