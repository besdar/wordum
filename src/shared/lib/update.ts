import packageJSON from '../../../package.json';

export const getRemoteAppVersion = () =>
  fetch(
    `https://api.github.com/repos/${packageJSON.repository}/releases/latest`,
  )
    .then(res => res.json())
    .then(res => res.tag_name?.replace('v', ''));
