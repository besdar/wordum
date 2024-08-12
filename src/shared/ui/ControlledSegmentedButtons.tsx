import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import {SegmentedButtons, Text} from 'react-native-paper';
import React from 'react';
import {View} from 'react-native';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof SegmentedButtons>,
    'onValueChange' | 'value'
  > & {
    label: string;
  };

export const ControlledSegmentedButtons = <T extends FieldValues>({
  name,
  rules,
  control,
  disabled,
  label,
  ...segmentedButtonsProps
}: Props<T>) => (
  <View>
    <Text>{label}</Text>
    <Controller
      name={name}
      rules={rules}
      control={control}
      disabled={disabled}
      render={({field}) => (
        <SegmentedButtons
          {...segmentedButtonsProps}
          value={field.value}
          onValueChange={field.onChange}
        />
      )}
    />
  </View>
);
