import {Alert} from 'react-native';
import {translate} from '../../../shared/lib/i18n';

export const showDeleteConfirmationAlert = () =>
  new Promise((resolve, reject) =>
    Alert.alert(
      translate('collection_deletion'),
      translate('collection_deletion_message'),
      [
        {text: translate('cancel'), onPress: reject, style: 'cancel'},
        {text: translate('yes'), onPress: resolve, style: 'default'},
      ],
      {cancelable: true},
    ),
  );
