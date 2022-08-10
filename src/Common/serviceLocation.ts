import chalk from 'chalk';
import Configstore from 'configstore';

interface ServiceLocationProps {
  location: 'US' | 'EU' | 'APJ';
  config: Configstore;
}

const initServiceLocation = ({ location, config }: ServiceLocationProps) => {
  if (location.toUpperCase() === 'US') {
    config.set('serviceUrl', 'api-us.boxever.com');
  } else if (location.toUpperCase() === 'EU') {
    config.set('serviceUrl', 'api.boxever.com');
  } else if (location.toUpperCase() === 'APJ') {
    config.set('serviceUrl', 'api-ap-southeast-2-production.boxever.com');
  } else {
    console.log(chalk.red('Service location not supported'));
  }

  console.log(config.get('serviceUrl'));
};

export { initServiceLocation };
