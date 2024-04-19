import chalk from 'chalk/index.js';
import { Command } from 'commander';
import Configstore from 'configstore';
import { initServiceLocation, logline } from '../../../utils/index.js';
import { PersonalizeConfig } from '../../../utils/personalizeConfig.js';
import { AuthService } from './Auth.service.js';

export const initAuthCommands = (program: Command, config: Configstore, personalizeConfig: PersonalizeConfig) => {
  const authService = AuthService(config, personalizeConfig);

  const authCommands = program.command('auth');

  authCommands
    .command('login')
    .requiredOption('-id, --clientId <clientId>', 'Client Id (Client Key)')
    .requiredOption('-s, --clientSecret <clientSecret>', 'Client Secret (API Token)')
    .option('-c, --cloudPortal', 'Add if you want to use Cloud Portal features')
    .option('-l, --location <location>', 'Service Location (EU, US, AP)', 'EU')
    .description('Authenticate with the API')
    .action(async (options) => {
      // Init Config Variables
      initServiceLocation({
        location: options.location,
        config: config,
        isCloudPortal: options.cloudPortal ?? false,
        isStaging: options.staging ?? false,
      });
      config.set('clientKey', options.clientkey);

      console.log(options);

      authService.Authenticate(options.clientId, options.clientSecret, options.cloudPortal ?? false);
    });

  authCommands
    .command('logout')
    .description('Logout of the API')
    .action(async (options) => {
      config.clear();
      logline(chalk.green('Successfully Logged Out'));
    });

  authCommands
    .command('status')
    .description('View Authentication/Service Url information')
    .action(async (options) => {
      logline(`Access Token: ${JSON.stringify(config.get('credentials'), null, 2)}`);
      logline(`Service Url: ${config.get('serviceUrl')}`);
    });

  // authCommands
  //   .command('refresh')
  //   .description('Refresh the Access Token or pass in client key to change Client')
  //   .option('-key, --clientkey <clientkey>', 'Client Key')
  //   .action(async (options) => {
  //     if (options !== undefined && options.clientkey !== undefined) {
  //       const currentKey = globalConfig.get('clientKey');

  //       if (currentKey !== options.clientkey) {
  //         logline(chalk.yellow(`Changing Client Key from ${currentKey} to ${options.clientkey}`));
  //       }

  //       globalConfig.set('clientKey', options.clientkey);
  //     }

  //     let refreshToken: string = globalConfig.get('credentials')?.refresh_token;

  //     if (!refreshToken) {
  //       logline(chalk.red('No Access Token Found'));
  //       return;
  //     }

  //     await Refresh(refreshToken, options.clientkey);
  //   });

  return authCommands;
};
