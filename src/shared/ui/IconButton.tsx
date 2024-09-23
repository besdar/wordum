import React, {useState} from 'react';
import {IconButton as PaperButton} from 'react-native-paper';

type Props = React.ComponentProps<typeof PaperButton> & {
  noLoading?: boolean;
};

export const IconButton = ({
  onPress,
  disabled,
  loading,
  noLoading,
  ...props
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PaperButton
      {...props}
      onPress={e => {
        setIsLoading(true);
        Promise.resolve(onPress?.(e)).finally(() => setIsLoading(false));
      }}
      loading={!noLoading && (loading || isLoading)}
      disabled={disabled || isLoading}
    />
  );
};
