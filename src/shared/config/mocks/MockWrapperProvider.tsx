import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  DefaultValues,
} from 'react-hook-form';
import {Button, PaperProvider} from 'react-native-paper';

export const SUBMIT_TEST_BUTTON = 'SUBMIT_TEST_BUTTON';

export const MockWrapperProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <PaperProvider>
    <NavigationContainer>{children}</NavigationContainer>
  </PaperProvider>
);

type MockFormProviderProps = {
  children: React.ReactNode;
  onSubmit?: SubmitHandler<FieldValues>;
  defaultValues?: DefaultValues<FieldValues>;
};

export const MockFormProvider = ({
  children,
  onSubmit = () => {},
  defaultValues = {},
}: MockFormProviderProps) => {
  const methods = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      {children}
      <Button
        onPress={methods.handleSubmit(onSubmit)}
        testID={SUBMIT_TEST_BUTTON}>
        Submit
      </Button>
    </FormProvider>
  );
};
