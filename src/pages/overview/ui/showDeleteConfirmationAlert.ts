import {Alert} from 'react-native';
import i18n from '../../../shared/lib/i18n';

export const showDeleteConfirmationAlert = () =>
  new Promise((resolve, reject) =>
    Alert.alert(
      i18n.t('collection_deletion'),
      i18n.t('collection_deletion_message'),
      [
        {text: i18n.t('cancel'), onPress: reject, style: 'cancel'},
        {text: i18n.t('yes'), onPress: resolve, style: 'default'},
      ],
      {cancelable: true},
    ),
  );
