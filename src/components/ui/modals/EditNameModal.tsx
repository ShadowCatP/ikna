import { FieldError } from '@/components/forms/FieldError';
import { Input } from '@/components/forms/Input';
import { Button } from '@/components/ui/common/Button';
import { Modal } from '@/components/ui/common/Modal';
import { errorText } from '@/utils/form';
import { supabase } from '@/utils/supabase';
import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { z } from 'zod';

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name cannot be empty')
  .max(30, 'Name should be less than 30 characters');

type EditNameModalProps = {
  visible: boolean;
  initialName: string;
  onClose: () => void;
};

export function EditNameModal({
  visible,
  initialName,
  onClose,
}: EditNameModalProps) {
  const form = useForm({
    defaultValues: { name: initialName },
    validators: { onSubmit: z.object({ name: nameSchema }) },
    onSubmit: async ({ value, formApi }) => {
      formApi.setErrorMap({ onSubmit: undefined });

      try {
        const { error } = await supabase.auth.updateUser({
          data: { display_name: value.name.trim() },
        });

        if (error) {
          formApi.setErrorMap({
            onSubmit: { form: error.message, fields: {} },
          });
          return;
        }

        handleClose();
      } catch {
        formApi.setErrorMap({
          onSubmit: {
            form: 'Could not connect. Please try again.',
            fields: {},
          },
        });
      }
    },
  });

  useEffect(() => {
    if (!visible) return;
    form.setFieldValue('name', initialName);
    form.setErrorMap({ onSubmit: undefined });
  }, [form, initialName, visible]);

  function handleClose() {
    form.reset();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      closeAccessibilityLabel="Close edit name"
    >
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(busy) => (
          <View className="gap-4">
            <Text className="text-foreground text-2xl font-bold">
              Edit name
            </Text>
            <form.Field name="name">
              {(field) => (
                <>
                  <Input
                    autoFocus
                    value={field.state.value}
                    onChangeText={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Your name"
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoComplete="name"
                    textContentType="name"
                    editable={!busy}
                    returnKeyType="done"
                    onSubmitEditing={() => void form.handleSubmit()}
                    accessibilityLabel="Display name"
                  />
                  <FieldError meta={field.state.meta} />
                </>
              )}
            </form.Field>
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(submitError) => {
                const message = errorText([submitError]);
                return message ? (
                  <Text
                    accessibilityRole="alert"
                    className="text-danger text-sm"
                  >
                    {message}
                  </Text>
                ) : null;
              }}
            </form.Subscribe>
            <View className="gap-3">
              <Button
                className="bg-accent flex-1"
                onPress={() => void form.handleSubmit()}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-surface text-base font-semibold">
                    Save
                  </Text>
                )}
              </Button>
              <Button
                className="bg-surface flex-1"
                onPress={handleClose}
                disabled={busy}
              >
                <Text className="text-base font-semibold">Cancel</Text>
              </Button>
            </View>
          </View>
        )}
      </form.Subscribe>
    </Modal>
  );
}
