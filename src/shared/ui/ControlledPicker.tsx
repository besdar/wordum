import {Picker} from '@react-native-picker/picker';
import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof Picker>,
    'onValueChange' | 'selectedValue' | 'enabled'
  > & {label: string};

export const ControlledPicker = <T extends FieldValues>({
  control,
  name,
  rules,
  disabled,
  children,
  label,
  ...pickerProps
}: Props<T>) => (
  <View>
    <Text>{label}</Text>
    <Controller
      name={name}
      rules={rules}
      control={control}
      disabled={disabled}
      render={({field}) => (
        <Picker
          {...pickerProps}
          selectedValue={field.value}
          onValueChange={field.onChange}
          enabled={!field.disabled}>
          {children}
        </Picker>
      )}
    />
  </View>
);
