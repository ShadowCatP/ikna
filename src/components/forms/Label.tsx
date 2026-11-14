import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { Text } from 'react-native';

type LabelProps = {
  children: ReactNode;
  className?: string;
};

export function Label({ children, className }: LabelProps) {
  return (
    <Text
      className={cn(
        'text-muted text-xs font-medium tracking-wide uppercase',
        className
      )}
    >
      {children}
    </Text>
  );
}
