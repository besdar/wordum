import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import {SegmentedButtons} from 'react-native-paper';
import React from 'react';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof SegmentedButtons>,
    'onValueChange' | 'value'
  >;

export const ControlledSegmentedButtons = <T extends FieldValues>({
  name,
  rules,
  control,
  disabled,
  ...segmentedButtonsProps
}: Props<T>) => (
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
);
