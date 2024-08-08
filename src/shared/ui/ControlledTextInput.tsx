import {Controller, FieldValues, UseControllerProps} from 'react-hook-form';
import {HelperText, TextInput} from 'react-native-paper';
import React from 'react';
import {View} from 'react-native';

type Props<T extends FieldValues> = Omit<UseControllerProps<T>, 'render'> &
  Omit<
    React.ComponentProps<typeof TextInput>,
    'onChange' | 'onChangeText' | 'value' | 'disabled' | 'onBlur' | 'error'
  > & {
    viewProps?: React.ComponentProps<typeof View>;
  };

export const ControlledTextInput = <T extends FieldValues>({
  control,
  name,
  rules,
  disabled,
  viewProps = {},
  ...inputProps
}: Props<T>) => (
  <Controller
    name={name}
    rules={rules}
    control={control}
    disabled={disabled}
    render={({field, fieldState}) => (
      <View {...viewProps}>
        <TextInput
          {...inputProps}
          value={String(field.value)}
          onChangeText={field.onChange}
          disabled={field.disabled}
          onBlur={field.onBlur}
          error={Boolean(fieldState.error)}
        />
        <HelperText
          // TODO: long error text moves other elements out of the screen
          // eslint-disable-next-line react-native/no-inline-styles
          style={{width: '100%'}}
          type="error"
          visible={Boolean(fieldState.error?.message)}
          disabled={field.disabled}>
          {fieldState.error?.message}
        </HelperText>
      </View>
    )}
  />
);
