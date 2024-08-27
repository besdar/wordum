import packageJSON from '../../../package.json';

export const getRemoteAppVersion = () =>
  fetch(
    `https://raw.githubusercontent.com/${packageJSON.repository}/main/package.json`,
  )
    .then(res => res.json())
    .then(res => res.version || packageJSON.version);
