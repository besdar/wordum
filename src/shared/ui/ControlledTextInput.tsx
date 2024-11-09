import {
  Controller,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from 'react-hook-form';
import {HelperText, TextInput} from 'react-native-paper';
import React from 'react';
import {StyleSheet, TextStyle, View} from 'react-native';

const styles = StyleSheet.create({
  view: {
    flexGrow: 1,
  },
  helperText: {
    width: '100%',
    flexShrink: 1,
  },
});

type Props<T extends FieldValues, TName extends FieldPath<T>> = Omit<
  UseControllerProps<T, TName>,
  'render'
> &
  Omit<
    React.ComponentProps<typeof TextInput>,
    'onChange' | 'onChangeText' | 'value' | 'disabled' | 'onBlur' | 'error'
  > & {
    viewProps?: React.ComponentProps<typeof View>;
    helperText?: string;
  };

export const ControlledTextInput = <
  T extends FieldValues,
  TName extends FieldPath<T>,
>({
  control,
  name,
  rules,
  disabled,
  viewProps = {},
  helperText,
  ...inputProps
}: Props<T, TName>) => (
  <Controller
    name={name}
    rules={rules}
    control={control}
    disabled={disabled}
    render={({field, fieldState}) => (
      <View {...viewProps} style={[styles.view, viewProps.style]}>
        <TextInput
          {...inputProps}
          value={String(field.value)}
          onChangeText={field.onChange}
          disabled={field.disabled}
          onBlur={field.onBlur}
          error={Boolean(fieldState.error)}
          testID={`input_${name}`}
        />
        <HelperText
          // @ts-ignore - TODO: Bug after package updates
          style={[
            styles.helperText,
            {
              display:
                fieldState.error?.message || helperText ? undefined : 'none',
            } as TextStyle,
          ]}
          type={helperText ? 'info' : 'error'}
          visible={Boolean(fieldState.error?.message || helperText)}>
          {fieldState.error?.message || helperText}
        </HelperText>
      </View>
    )}
  />
);
