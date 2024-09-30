import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKeys {
  COLLECTIONS = 'COLLECTIONS',
  APP_SETTINGS = 'APP_SETTINGS',
  PREVIOUS_VERSION = 'PREVIOUS_VERSION',
  DAYS_WITHOUT_LEARNING = 'DAYS_WITHOUT_LEARNING',
}

export const getDataExport = () =>
  AsyncStorage.getAllKeys().then(keys =>
    Promise.all(keys.map(key => AsyncStorage.getItem(key))),
  );
