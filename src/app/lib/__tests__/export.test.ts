import {PermissionsAndroid} from 'react-native';
import {DownloadDirectoryPath, writeFile} from '@dr.pogodin/react-native-fs';
import {getDataExport} from '../../../shared/model/storage';
import {showToastMessage} from '../../../shared/lib/message';
import {exportData} from '../export';
import packageJSON from '../../../../package.json';
import {askForPermission} from '../../../shared/lib/permissions';

jest.mock('../../../shared/model/storage', () => ({
  getDataExport: jest.fn(),
}));

jest.mock('../../../shared/lib/message', () => ({
  showToastMessage: jest.fn(),
}));

jest.mock('../../../shared/lib/permissions', () => ({
  askForPermission: jest.fn(),
}));

describe('exportData', () => {
  const mockData = {key: 'value'};
  const mockExportPath = `${DownloadDirectoryPath}/${packageJSON.name}-export-${packageJSON.version}.json`;

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export data successfully', async () => {
    (askForPermission as jest.Mock).mockResolvedValue(undefined);
    (getDataExport as jest.Mock).mockResolvedValue(mockData);
    (writeFile as jest.Mock).mockResolvedValue(undefined);

    await exportData();

    expect(askForPermission).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    expect(getDataExport).toHaveBeenCalled();
    expect(writeFile).toHaveBeenCalledWith(
      mockExportPath,
      JSON.stringify(mockData),
      'utf8',
    );
    expect(showToastMessage).toHaveBeenCalledWith(
      `${'exported_successfully'} "${mockExportPath}"`,
    );
  });

  it('should show error message when permission is denied', async () => {
    (askForPermission as jest.Mock).mockRejectedValue(undefined);

    await exportData();

    expect(showToastMessage).toHaveBeenCalledWith('something_went_wrong');
  });

  it('should show error message when getDataExport fails', async () => {
    (askForPermission as jest.Mock).mockResolvedValue(undefined);
    (getDataExport as jest.Mock).mockRejectedValue(
      new Error('Failed to get data'),
    );

    await exportData();

    expect(showToastMessage).toHaveBeenCalledWith('something_went_wrong');
  });

  it('should show error message when writeFile fails', async () => {
    (askForPermission as jest.Mock).mockResolvedValue(undefined);
    (getDataExport as jest.Mock).mockResolvedValue(mockData);
    (writeFile as jest.Mock).mockRejectedValue('Failed to write file');

    await exportData();

    expect(showToastMessage).toHaveBeenCalledWith('something_went_wrong');
  });
});
