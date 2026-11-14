import { Label } from '@/components/forms/Label';
import { Modal } from '@/components/ui/common/Modal';
import { Lucide } from '@/components/ui/icons';
import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export type DropdownOption = {
  label: string;
  value: string;
};

type DropdownMenuTriggerProps = {
  label?: string;
  title: string;
  subtitle?: string;
  leading: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
};

export function DropdownMenuTrigger({
  label,
  title,
  subtitle,
  leading,
  onPress,
  accessibilityLabel,
}: DropdownMenuTriggerProps) {
  return (
    <View className={label ? 'gap-2' : undefined}>
      {label && <Label>{label}</Label>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        className="bg-surface min-h-20 flex-row items-center rounded-2xl px-4"
      >
        {leading}
        <View className="ml-4 flex-1">
          <Text className="text-foreground text-lg">{title}</Text>
          {subtitle && <Text className="text-muted text-sm">{subtitle}</Text>}
        </View>
        <Lucide name="chevron-down" size={22} className="text-muted" />
      </Pressable>
    </View>
  );
}

type DropdownMenuProps = {
  visible: boolean;
  title: string;
  options: readonly DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  isLoading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  closeAccessibilityLabel?: string;
};

export function DropdownMenu({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  isLoading = false,
  errorMessage,
  emptyMessage = 'No options available.',
  closeAccessibilityLabel = 'Close dropdown menu',
}: DropdownMenuProps) {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeAccessibilityLabel={closeAccessibilityLabel}
    >
      <Text className="text-foreground mb-4 text-2xl font-bold">{title}</Text>
      {isLoading ? (
        <ActivityIndicator className="text-primary" />
      ) : errorMessage ? (
        <Text className="text-danger text-base">{errorMessage}</Text>
      ) : options.length === 0 ? (
        <Text className="text-muted text-base">{emptyMessage}</Text>
      ) : (
        <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityLabel={`Choose ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className={`min-h-14 flex-row items-center justify-between rounded-2xl px-4 ${isSelected ? 'bg-primary-soft' : 'bg-surface'}`}
                >
                  <Text className="text-foreground text-base">
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Lucide name="check" size={20} className="text-primary" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
    </Modal>
  );
}
