import packageJSON from '../../../../package.json';
import {getRemoteAppVersion} from '../update';

describe('getRemoteAppVersion', () => {
  let fetchSpy = jest.spyOn(global, 'fetch');

  beforeEach(() => {
    fetchSpy = jest.spyOn(global, 'fetch');
  });

  afterAll(() => {
    fetchSpy.mockRestore();
  });

  it('should return the version from the remote package.json', async () => {
    const mockVersion = '1.0.0';
    const mockResponse = {
      version: mockVersion,
    };

    fetchSpy.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    } as unknown as Response);

    const version = await getRemoteAppVersion();

    expect(fetchSpy).toHaveBeenCalledWith(
      `https://raw.githubusercontent.com/${packageJSON.repository}/main/package.json`,
    );
    expect(version).toBe(mockVersion);
  });

  it('should throw an error if the fetch fails', async () => {
    fetchSpy.mockRejectedValueOnce(new Error('Network error'));

    await expect(getRemoteAppVersion()).rejects.toThrow('Network error');
  });

  it('should throw an error if the response is not valid JSON', async () => {
    fetchSpy.mockResolvedValueOnce({
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    } as unknown as Response);

    await expect(getRemoteAppVersion()).rejects.toThrow('Invalid JSON');
  });
});
