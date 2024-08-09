import {Alert} from 'react-native';

export const showDeleteConfirmationAlert = () =>
  new Promise((resolve, reject) =>
    Alert.alert(
      'Collection deletion',
      'Are you sure you want to delete this collection?',
      [
        {text: 'Cancel', onPress: reject, style: 'cancel'},
        {text: 'Yes', onPress: resolve, style: 'default'},
      ],
      {cancelable: true},
    ),
  );
