import {writeFile, DownloadDirectoryPath} from '@dr.pogodin/react-native-fs';
import {getDataExport} from '../../shared/model/storage';
import {showToastMessage} from '../../shared/lib/message';
import {translate} from '../../shared/lib/i18n';
import packageJSON from '../../../package.json';
import {askForPermission} from '../../shared/lib/permissions';
import {PermissionsAndroid} from 'react-native';

const EXPORT_PATH = `${DownloadDirectoryPath}/${packageJSON.name}-export-${packageJSON.version}.json`;

export const exportData = () =>
  askForPermission(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    .then(() => getDataExport())
    .then(data => writeFile(EXPORT_PATH, JSON.stringify(data), 'utf8'))
    .then(() =>
      showToastMessage(
        `${translate('exported_successfully')} "${EXPORT_PATH}"`,
      ),
    )
    .catch(() => showToastMessage(translate('something_went_wrong')));
