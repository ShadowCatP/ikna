import { cn } from '@/utils/cn';
import { Pressable, type PressableProps } from 'react-native';

const buttonBaseClasses = 'items-center justify-center active:opacity-60';

const buttonSizeClasses = {
  default: 'min-h-14 rounded-2xl px-4 py-3.5',
  icon: 'size-12 rounded-full p-0',
} as const;

const buttonVariantClasses = {
  default: 'bg-foreground',
  destructive: 'bg-danger',
  outline: 'bg-background border-foreground border-2',
  surface: 'bg-surface',
  accent: 'bg-accent',
} as const;

type ButtonProps = PressableProps & {
  className?: string;
  size?: keyof typeof buttonSizeClasses;
  variant?: keyof typeof buttonVariantClasses;
};

export function Button({
  className,
  children,
  disabled,
  size = 'default',
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
        buttonSizeClasses[size],
        buttonVariantClasses[variant],
        disabled && 'opacity-60',
        className
      )}
    >
      {children}
    </Pressable>
  );
}
