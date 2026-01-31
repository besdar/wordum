import packageJSON from '../../../../package.json';
import {getRemoteAppVersion} from '../update';

describe('getRemoteAppVersion', () => {
  it('should return the version from the remote package.json', async () => {
    const mockVersion = 'v1.0.0';
    const mockResponse = {
      tag_name: mockVersion,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    } as unknown as Response);

    const version = await getRemoteAppVersion();

    expect(fetch).toHaveBeenCalledWith(
      `https://api.github.com/repos/${packageJSON.repository}/releases/latest`,
    );
    expect(version).toBe(mockVersion.replace('v', ''));
  });

  it('should throw an error if the fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(getRemoteAppVersion()).rejects.toThrow('Network error');
  });

  it('should throw an error if the response is not valid JSON', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    } as unknown as Response);

    await expect(getRemoteAppVersion()).rejects.toThrow('Invalid JSON');
  });
});
