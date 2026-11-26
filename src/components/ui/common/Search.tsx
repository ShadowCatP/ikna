import { Input } from '@/components/forms/Input';
import { Lucide } from '@/components/ui/icons';
import { useState } from 'react';
import { Pressable, View, type TextInputProps } from 'react-native';

type SearchProps = {
  value: string;
  onChangeText: (value: string) => void;
  accessibilityLabel: string;
  placeholder?: TextInputProps['placeholder'];
  className?: string;
  onStartSearch?: (isActive: boolean) => void;
};

export function Search({
  value,
  onChangeText,
  accessibilityLabel,
  placeholder = 'Search',
  onStartSearch: onActiveChange,
}: SearchProps) {
  const [isActive, setIsActive] = useState(false);

  function openSearch() {
    setIsActive(true);
    onActiveChange?.(true);
  }

  function closeSearch() {
    onChangeText('');
    setIsActive(false);
    onActiveChange?.(false);
  }

  if (!isActive) {
    return (
      <View className="h-16 justify-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          onPress={openSearch}
          className="bg-surface size-12 items-center justify-center rounded-full"
        >
          <Lucide name="search" size={20} className="text-foreground" />
        </Pressable>
      </View>
    );
  }

  return (
    <Input
      autoFocus
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      returnKeyType="search"
      accessibilityLabel={accessibilityLabel}
      containerClassName="flex-1 h-16 rounded-full px-4"
      leftChild={<Lucide name="search" size={20} className="text-muted mr-2" />}
      rightChild={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close search"
          hitSlop={8}
          onPress={closeSearch}
          className="ml-2 items-center justify-center"
        >
          <Lucide name="x" size={20} className="text-muted" />
        </Pressable>
      }
    />
  );
}
