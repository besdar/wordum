import packageJSON from '../../../package.json';

export const getRemoteAppVersion = () =>
  fetch(`${packageJSON.homepage}/main/package.json`)
    .then(res => res.json())
    .then(res => res.version || packageJSON.version);
