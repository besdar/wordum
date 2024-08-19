import {Alert, ToastAndroid} from 'react-native';
import {translate} from './i18n';

export const showToastMessage = (
  message: string,
  duration = ToastAndroid.SHORT,
) => ToastAndroid.show(message, duration);

export const showConfirmationAlert = (title: string, message: string) =>
  new Promise((resolve, reject) =>
    Alert.alert(
      title,
      message,
      [
        {text: translate('cancel'), onPress: reject, style: 'cancel'},
        {text: translate('yes'), onPress: resolve, style: 'default'},
      ],
      {cancelable: true},
    ),
  );
