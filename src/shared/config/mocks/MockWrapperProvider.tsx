import {NavigationContainer} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import {Button, PaperProvider} from 'react-native-paper';

const queryClient = new QueryClient();
export const SUBMIT_TEST_BUTTON = 'SUBMIT_TEST_BUTTON';

export const MockWrapperProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <PaperProvider>
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>{children}</NavigationContainer>
    </QueryClientProvider>
  </PaperProvider>
);

type MockFormProviderProps = {
  children: React.ReactNode;
  onSubmit?: SubmitHandler<FieldValues>;
};

export const MockFormProvider = ({
  children,
  onSubmit = () => {},
}: MockFormProviderProps) => {
  const methods = useForm();

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
