import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppSettings, AppSettingsValues} from '../AppSettings';
import {StorageKeys} from '../storage';
import {APISources} from '../apiSources';
import {getRemoteAppVersion} from '../../lib/update';
import packageJSON from '../../../../package.json';

jest.mock('../../lib/update', () => ({
  getRemoteAppVersion: jest.fn(),
}));

describe('AppSettings', () => {
  beforeEach(() => {
    (getRemoteAppVersion as jest.Mock).mockResolvedValue(packageJSON.version);
  });

  describe('constructor', () => {
    it('should initialize with default settings', async () => {
      const appSettings = new AppSettings();
      await appSettings.isReady();

      expect(appSettings.getSettings()).toEqual({
        apiSource: APISources.ReversoContextUnofficial,
        showAdditionalStat: false,
        timeGradeLimitEasy: 7000,
        timeGradeLimitGood: 15000,
        timeTakenPerCharacterInput: 250,
      });
    });
  });

  describe('isReady', () => {
    it('should return a promise that resolves when initialization is complete', async () => {
      const appSettings = new AppSettings();
      const isReady = appSettings.isReady();

      await expect(isReady).resolves.toBeUndefined();
    });
  });

  describe('getSetting', () => {
    it('should return the value of a specific setting', async () => {
      const appSettings = new AppSettings();
      await appSettings.isReady();

      const apiSource = appSettings.getSetting('apiSource');
      expect(apiSource).toBe(APISources.ReversoContextUnofficial);
    });
  });

  describe('getSettings', () => {
    it('should return a copy of the settings', async () => {
      const appSettings = new AppSettings();
      await appSettings.isReady();

      const settings = appSettings.getSettings();
      expect(settings).toEqual({
        apiSource: APISources.ReversoContextUnofficial,
        showAdditionalStat: false,
        timeGradeLimitEasy: 7000,
        timeGradeLimitGood: 15000,
        timeTakenPerCharacterInput: 250,
      });
      expect(settings).not.toBe(appSettings.getSettings()); // Ensure it's a copy
    });
  });

  describe('setSettings', () => {
    it('should update settings and save them', async () => {
      const appSettings = new AppSettings();
      await appSettings.isReady();

      const newSettings: AppSettingsValues = {
        apiSource: APISources.ReversoContextUnofficial,
        showAdditionalStat: true,
        timeGradeLimitEasy: 5000,
        timeGradeLimitGood: 10000,
        timeTakenPerCharacterInput: 200,
      };

      await appSettings.setSettings(newSettings);

      expect(appSettings.getSettings()).toEqual(newSettings);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        StorageKeys.APP_SETTINGS,
        JSON.stringify(newSettings),
      );
    });
  });

  describe('isUpdateAvailable', () => {
    it('should return false if no update is available', async () => {
      const appSettings = new AppSettings();
      await appSettings.isReady();

      expect(appSettings.isUpdateAvailable()).toBe(false);
    });

    it('should return true if an update is available', async () => {
      (getRemoteAppVersion as jest.Mock).mockResolvedValue(
        packageJSON.version + 1,
      ); // Mock a different remote version
      const appSettings = new AppSettings();
      await appSettings.isReady();

      expect(appSettings.isUpdateAvailable()).toBe(true);
    });
  });

  describe('init', () => {
    it('should load settings from AsyncStorage if available', async () => {
      const mockSettings = {
        apiSource: APISources.ReversoContextUnofficial,
        showAdditionalStat: true,
        timeGradeLimitEasy: 6000,
        timeGradeLimitGood: 12000,
        timeTakenPerCharacterInput: 300,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockSettings),
      );

      const appSettings = new AppSettings();
      await appSettings.isReady();

      expect(appSettings.getSettings()).toEqual({
        ...appSettings.getSettings(),
        ...mockSettings,
      });
    });
  });
});
