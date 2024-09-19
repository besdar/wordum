import {PermissionsAndroid, Platform} from 'react-native';
import {askForPermission} from '../permissions';

describe('askForPermission', () => {
  const originalPlatformVersion = Platform.Version;

  afterEach(() => {
    Object.defineProperty(Platform, 'Version', {
      get: () => originalPlatformVersion,
    });
  });

  it('should return true if the platform version is 33 or higher and permission is WRITE_EXTERNAL_STORAGE', async () => {
    Object.defineProperty(Platform, 'Version', {
      get: () => 33,
    });

    const result = await askForPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    expect(result).toBe(true);
  });

  it('should check permission and return if already granted', async () => {
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(true);
    await askForPermission(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );

    expect(PermissionsAndroid.check).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  });

  it('should request permission if not granted and throw an error if denied', async () => {
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(false);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
      PermissionsAndroid.RESULTS.DENIED,
    );

    await expect(
      askForPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE),
    ).rejects.toThrow();

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  });

  it('should request permission if not granted and resolve if granted', async () => {
    (PermissionsAndroid.check as jest.Mock).mockResolvedValue(false);
    (PermissionsAndroid.request as jest.Mock).mockResolvedValue(
      PermissionsAndroid.RESULTS.GRANTED,
    );

    await expect(
      askForPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE),
    ).resolves.toBeUndefined();

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
  });
});
