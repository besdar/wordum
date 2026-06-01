import React from 'react';
import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import {SegmentedButtons, Text} from 'react-native-paper';
import {Grid} from './Grid';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof SegmentedButtons>,
    'onValueChange' | 'value' | 'disabled'
  > & {
    label: string;
  };

export const ControlledSegmentedButtons = <T extends FieldValues>({
  name,
  rules,
  control,
  label,
  ...segmentedButtonsProps
}: Props<T>) => (
  <Grid direction="column" rowGap={5}>
    <Text>{label}</Text>
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({field}) => {
        const fieldProps = {
          ...segmentedButtonsProps,
          value: field.value,
          onValueChange: field.onChange,
        } as React.ComponentProps<typeof SegmentedButtons>;

        return <SegmentedButtons {...fieldProps} />;
      }}
    />
  </Grid>
);
