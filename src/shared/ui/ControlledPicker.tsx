import React from 'react';
import {Controller, FieldPath, FieldValues} from 'react-hook-form';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import {ControlledTextInput} from './ControlledTextInput';
import {useAppTheme} from './theme';

const styles = StyleSheet.create({
  modal: {
    padding: 20,
    width: '80%',
    margin: 'auto',
    borderRadius: 10,
    maxHeight: '90%',
  },
  item: {
    padding: 5,
  },
  items: {
    width: '100%',
  },
});

type PickerItem = {
  value: string;
  label: string;
};

type Props<T extends FieldValues, TName extends FieldPath<T>> = {
  items: PickerItem[];
} & React.ComponentProps<typeof ControlledTextInput<T, TName>>;

export const ControlledPicker = <
  T extends FieldValues,
  TName extends FieldPath<T>,
>({
  items,
  control,
  name,
  rules,
  disabled,
  viewProps = {},
  ...inputProps
}: Props<T, TName>) => {
  const [visible, setVisible] = React.useState(false);
  const theme = useAppTheme();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      disabled={disabled}
      render={({field, fieldState}) => (
        <View {...viewProps}>
          <TextInput
            {...inputProps}
            value={items.find(item => item.value === field.value)?.label}
            disabled={field.disabled}
            onBlur={field.onBlur}
            error={Boolean(fieldState.error)}
            editable={false}
            mode="outlined"
            right={
              <TextInput.Icon
                icon="arrow-down-drop-circle"
                onPress={() => setVisible(true)}
              />
            }
          />
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              contentContainerStyle={[
                styles.modal,
                {backgroundColor: theme.colors.background},
              ]}>
              <ScrollView
                style={styles.items}
                keyboardShouldPersistTaps="handled">
                {items.map(item => (
                  <TouchableRipple
                    key={item.value}
                    onPress={() => {
                      field.onChange(item.value);
                      setVisible(false);
                    }}>
                    <Text variant="bodyLarge" style={styles.item}>
                      {item.label}
                    </Text>
                  </TouchableRipple>
                ))}
              </ScrollView>
            </Modal>
          </Portal>
        </View>
      )}
    />
  );
};
