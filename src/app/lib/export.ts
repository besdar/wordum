import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import packageJSON from '../../../package.json';
import {translate} from '../../shared/lib/i18n';
import {showToastMessage} from '../../shared/lib/message';
import {getDataExport} from '../../shared/model/storage';

const EXPORT_FILE_NAME = `${packageJSON.name}-export-${packageJSON.version}.json`;

const createExportFile = (data: unknown) => {
  const exportFile = new File(Paths.cache, EXPORT_FILE_NAME);

  exportFile.create({overwrite: true});
  exportFile.write(JSON.stringify(data));

  return exportFile;
};

export const exportData = () =>
  getDataExport()
    .then(createExportFile)
    .then(async exportFile => {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(exportFile.uri, {
          mimeType: 'application/json',
          dialogTitle: translate('exported_successfully'),
        });
      }

      showToastMessage(
        `${translate('exported_successfully')} "${exportFile.uri}"`,
      );
    })
    .catch(() => showToastMessage(translate('something_went_wrong')));
