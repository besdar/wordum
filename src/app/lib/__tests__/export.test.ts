import {File} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {getDataExport} from '../../../shared/model/storage';
import {showToastMessage} from '../../../shared/lib/message';
import {exportData} from '../export';
import packageJSON from '../../../../package.json';

jest.mock('../../../shared/model/storage', () => ({
  getDataExport: jest.fn(),
}));

jest.mock('../../../shared/lib/message', () => ({
  showToastMessage: jest.fn(),
}));

describe('exportData', () => {
  const mockData = {key: 'value'};
  const mockExportFileName = `${packageJSON.name}-export-${packageJSON.version}.json`;
  const MockFile = File as unknown as jest.Mock;

  beforeEach(() => {
    MockFile.mockImplementation((...pathParts) => ({
      uri: pathParts
        .map(part => (typeof part === 'string' ? part : part.uri))
        .join('/'),
      create: jest.fn(),
      write: jest.fn(),
      text: jest.fn(),
    }));
    (Sharing.isAvailableAsync as jest.Mock).mockResolvedValue(true);
    (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should export data successfully', async () => {
    (getDataExport as jest.Mock).mockResolvedValue(mockData);

    await exportData();

    expect(getDataExport).toHaveBeenCalled();
    expect(File).toHaveBeenCalledWith(
      expect.objectContaining({uri: 'file:///mock/cache'}),
      mockExportFileName,
    );
    const exportFile = MockFile.mock.results[0].value;

    expect(exportFile.create).toHaveBeenCalledWith({overwrite: true});
    expect(exportFile.write).toHaveBeenCalledWith(JSON.stringify(mockData));
    expect(Sharing.shareAsync).toHaveBeenCalledWith(exportFile.uri, {
      mimeType: 'application/json',
      dialogTitle: 'exported_successfully',
    });
    expect(showToastMessage).toHaveBeenCalledWith(
      `${'exported_successfully'} "${exportFile.uri}"`,
    );
  });

  it('should show error message when getDataExport fails', async () => {
    (getDataExport as jest.Mock).mockRejectedValue(
      new Error('Failed to get data'),
    );

    await exportData();

    expect(showToastMessage).toHaveBeenCalledWith('something_went_wrong');
  });

  it('should show error message when writeFile fails', async () => {
    (getDataExport as jest.Mock).mockResolvedValue(mockData);
    const exportFile = {
      uri: 'file:///mock/cache/export.json',
      create: jest.fn(),
      write: jest.fn(() => {
        throw new Error('Failed to write file');
      }),
    };

    MockFile.mockImplementationOnce(() => exportFile);

    await exportData();

    expect(showToastMessage).toHaveBeenCalledWith('something_went_wrong');
  });
});
