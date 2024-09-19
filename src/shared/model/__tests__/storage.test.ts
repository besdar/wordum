import {getDataExport} from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

describe('getDataExport', () => {
  it('should return all stored data', async () => {
    const mockValues = {
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
    };
    const mockKeys = Object.keys(mockValues);

    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue(mockKeys);
    (AsyncStorage.getItem as jest.Mock).mockImplementation(
      (key: keyof typeof mockValues) => Promise.resolve(mockValues[key]),
    );

    const result = await getDataExport();

    expect(result).toEqual(['value1', 'value2', 'value3']);
    expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.getItem).toHaveBeenCalledTimes(mockKeys.length);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key1');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key2');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key3');
  });

  it('should handle empty storage', async () => {
    (AsyncStorage.getAllKeys as jest.Mock).mockResolvedValue([]);

    const result = await getDataExport();

    expect(result).toEqual([]);
    expect(AsyncStorage.getAllKeys).toHaveBeenCalledTimes(1);
  });
});
