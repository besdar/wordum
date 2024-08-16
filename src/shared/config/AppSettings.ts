import AsyncStorage from '@react-native-async-storage/async-storage';
import {APISources} from '../model/apiSources';
import {StorageKeys} from '../model/storage';
import {getRemoteAppVersion} from '../lib/update';
import packageJSON from '../../../package.json';

export type AppSettingsValues = {
  apiSource: APISources;
};

class AppSettings {
  #isUpdateAvailable: boolean = false;
  #settings: AppSettingsValues = {
    apiSource: APISources.ReversoContextUnofficial,
  };

  constructor() {
    this.#init();
  }

  #saveSettings() {
    return AsyncStorage.setItem(
      StorageKeys.APP_SETTINGS,
      JSON.stringify(this.#settings),
    );
  }

  getSetting(key: keyof AppSettingsValues) {
    return this.#settings[key];
  }

  setSettings(settings: AppSettingsValues) {
    this.#settings = settings;

    return this.#saveSettings();
  }

  async #init() {
    const settings = await AsyncStorage.getItem(StorageKeys.APP_SETTINGS);

    if (settings) {
      this.#settings = JSON.parse(settings);
    }

    const remoteVersion = await getRemoteAppVersion();
    this.#isUpdateAvailable = remoteVersion === packageJSON.version;
  }

  isUpdateAvailable() {
    return this.#isUpdateAvailable;
  }
}

export const appSettings = new AppSettings();
