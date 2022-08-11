import Configstore from 'configstore';

const initConfig = () => {
  const config = new Configstore('sitecore-cdp-personalize-cli');
  return config;
};

export default initConfig;
