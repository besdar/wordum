import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import {Switch} from 'react-native-paper';
import {Grid} from './Grid';
import React from 'react';
import {Text} from 'react-native';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof Switch>,
    'onValueChange' | 'value' | 'disabled'
  > & {
    label: string;
  };

export const ControlledSwitcher = <T extends FieldValues>({
  control,
  name,
  rules,
  disabled,
  label,
  ...switchProps
}: Props<T>) => (
  <Controller
    name={name}
    rules={rules}
    control={control}
    disabled={disabled}
    render={({field}) => (
      <Grid justifyContent="space-between" alignItems="center">
        <Text>{label}</Text>
        <Switch
          {...switchProps}
          disabled={field.disabled}
          value={field.value}
          onValueChange={field.onChange}
        />
      </Grid>
    )}
  />
);
