import AsyncStorage from '@react-native-async-storage/async-storage';
import {APISources} from './apiSources';
import {StorageKeys} from './storage';
import {getRemoteAppVersion} from '../lib/update';
import packageJSON from '../../../package.json';

export type AppSettingsValues = {
  apiSource: APISources;
  showAdditionalStat: boolean;
  timeGradeLimitEasy: number;
  timeGradeLimitGood: number;
  timeTakenPerCharacterInput: number;
};

export class AppSettings {
  #initPromise = Promise.resolve();
  #isUpdateAvailable: boolean = false;
  #settings: AppSettingsValues = {
    apiSource: APISources.ReversoContextUnofficial,
    showAdditionalStat: false,
    timeGradeLimitEasy: 7000,
    timeGradeLimitGood: 15000,
    timeTakenPerCharacterInput: 250,
  };

  constructor() {
    this.#initPromise = this.#init();
  }

  isReady() {
    return this.#initPromise;
  }

  #saveSettings() {
    return AsyncStorage.setItem(
      StorageKeys.APP_SETTINGS,
      JSON.stringify(this.#settings),
    );
  }

  getSetting<T extends keyof AppSettingsValues>(key: T) {
    return this.#settings[key];
  }

  getSettings(): Readonly<AppSettingsValues> {
    return {...this.#settings};
  }

  setSettings(settings: AppSettingsValues) {
    this.#settings = settings;

    return this.#saveSettings();
  }

  async #init() {
    const settings = await AsyncStorage.getItem(StorageKeys.APP_SETTINGS);

    if (settings) {
      this.#settings = {...this.#settings, ...JSON.parse(settings)};
    }

    const remoteVersion = await getRemoteAppVersion();
    this.#isUpdateAvailable = remoteVersion !== packageJSON.version;
  }

  isUpdateAvailable() {
    return this.#isUpdateAvailable;
  }
}

export const appSettings = new AppSettings();
