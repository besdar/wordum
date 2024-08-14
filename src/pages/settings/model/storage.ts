import AsyncStorage from '@react-native-async-storage/async-storage';
import {StorageKeys} from '../../../shared/model/storage';
import {APISources} from '../../../shared/model/apiSources';

export const saveAPISource = (apiSource: APISources) =>
  AsyncStorage.setItem(StorageKeys.API_SOURCE, apiSource);
