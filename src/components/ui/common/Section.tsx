import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className }: SectionProps) {
  return (
    <View className={cn('gap-4', className)}>
      <Text className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
        {title}
      </Text>
      {children}
    </View>
  );
}
