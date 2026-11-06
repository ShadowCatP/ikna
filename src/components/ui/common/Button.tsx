import { Pressable, type PressableProps } from 'react-native';

type ButtonProps = PressableProps & {
  className?: string;
};

export function Button({
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      accessibilityRole="button"
      className={`bg-foreground min-h-14 items-center justify-center rounded-2xl px-4 py-3.5 active:opacity-60 ${disabled ? 'opacity-60' : ''} ${className ?? ''}`}
    >
      {children}
    </Pressable>
  );
}
