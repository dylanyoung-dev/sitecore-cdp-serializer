import chalk from 'chalk';
import Configstore from 'configstore';

interface ServiceLocationProps {
  location: 'US' | 'EU' | 'AP';
  isCloudPortal: boolean;
  isStaging: boolean;
  config: Configstore;
}

const initServiceLocation = ({ location, config, isCloudPortal, isStaging }: ServiceLocationProps) => {
  let serviceUrl: string = '';
  let authUrl: string = '';
  if (isCloudPortal) {
    if (isStaging) {
      authUrl = 'auth-staging-1.sitecore-staging.cloud';
      serviceUrl = 'api-engage-dev.sitecorecloud.io';
    } else {
      authUrl = 'auth.sitecorecloud.io';
      serviceUrl = `api-engage-${location.toLowerCase()}.sitecorecloud.io`;
    }
  } else {
    if (location.toUpperCase() === 'US') {
      serviceUrl = 'api-us.boxever.com';
    } else if (location.toUpperCase() === 'EU') {
      serviceUrl = 'api.boxever.com';
    } else if (location.toUpperCase() === 'AP') {
      serviceUrl = 'api-ap-southeast-2-production.boxever.com';
    } else {
      console.log(chalk.red('Service location not supported'));
    }

    authUrl = serviceUrl;
  }

  config.set('serviceUrl', serviceUrl);
  config.set('authUrl', authUrl);
};

export { initServiceLocation };
