import {Alert} from 'react-native';
import i18n from '../../../shared/lib/i18n';

export const showDeleteConfirmationAlert = () =>
  new Promise((resolve, reject) =>
    Alert.alert(
      i18n.translate('collection_deletion'),
      i18n.translate('collection_deletion_message'),
      [
        {text: i18n.translate('cancel'), onPress: reject, style: 'cancel'},
        {text: i18n.translate('yes'), onPress: resolve, style: 'default'},
      ],
      {cancelable: true},
    ),
  );
