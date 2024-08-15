import {ToastAndroid} from 'react-native';

export const showToastMessage = (
  message: string,
  duration = ToastAndroid.SHORT,
) => ToastAndroid.show(message, duration);
