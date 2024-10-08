import {Permission, PermissionsAndroid, Platform} from 'react-native';

export const askForPermission = async (permission: Permission) => {
  if (
    Number(Platform.Version) >= 33 &&
    [
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ].includes(permission)
  ) {
    return true;
  }

  const isPermissionGranted = await PermissionsAndroid.check(permission);
  if (isPermissionGranted) {
    return;
  }

  const requestResult = await PermissionsAndroid.request(permission);

  if (requestResult !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new Error();
  }
};
