import {Permission, PermissionsAndroid} from 'react-native';

export const askForPermission = async (permission: Permission) => {
  const isPermissionGranted = await PermissionsAndroid.check(permission);
  if (isPermissionGranted) {
    return;
  }

  const requestResult = await PermissionsAndroid.request(permission);

  if (requestResult !== PermissionsAndroid.RESULTS.GRANTED) {
    throw new Error();
  }
};
