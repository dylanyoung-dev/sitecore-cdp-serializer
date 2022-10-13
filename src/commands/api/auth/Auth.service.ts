import Configstore from 'configstore';
import { AuthToken } from './Auth.interface.js';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { Command } from 'commander';
import {
  initServiceLocation,
  logline,
  logSuccess,
  logError,
} from '../../../utils/index.js';

let globalConfig: Configstore;

const Authenticate = async (clientId: string, clientSecret: string) => {
  const serviceUrl = globalConfig.get('serviceUrl');

  if (!serviceUrl) {
    logline(chalk.red('Service URL not set, re-run auth command'));
  }

  const servicePath = `https://${serviceUrl}/v2/oauth/token`;

  const params = new URLSearchParams();

  params.append('grant_type', 'client_credentials');
  params.append('clientKey', clientId);

  const response: Response = await fetch(servicePath, {
    method: 'post',
    body: params,
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
  });

  if (response.ok) {
    let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

    if (authToken) {
      globalConfig.set('credentials', authToken);

      logSuccess('Token Stored for future uses');
    }
  } else {
    logError('Authentication Failed');
  }
};

// const Refresh = async (refreshToken: string, clientKey?: string) => {
//   const serviceUrl = globalConfig.get('serviceUrl');

//   if (!serviceUrl) {
//     logline(chalk.red('Service URL not set, re-run auth command'));
//   }

//   const servicePath = `https://${serviceUrl}/v2/oauth/token`;

//   const params = new URLSearchParams();

//   params.append('grant_type', 'refresh_token');
//   params.append('refresh_token', refreshToken);

//   if (clientKey) {
//     params.append('clientKey', clientKey);
//   }

//   const response: Response = await fetch(servicePath, {
//     method: 'post',
//     body: params,
//   });

//   if (response.ok) {
//     let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

//     if (authToken) {
//       globalConfig.set('credentials', authToken);

//       logline(chalk.green('Token Stored'));
//     } else {
//       logline(chalk.red('Authentication Failed'));
//       logline(chalk.red(await response.json()));
//     }
//   } else {
//     logline(chalk.red('Refresh Token failed, please re-authenticate'));
//   }
// };

const initAuthCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const authCommands = program.command('auth');

  authCommands
    .command('login')
    .requiredOption('-id, --clientId <clientId>', 'Client Id (Client Key)')
    .requiredOption('-s, --clientSecret <clientSecret>', 'Client Secret (API Token)')
    .option('-l, --location <location>', 'Service Location (EU, US, APJ)', 'EU')
    .description('Authenticate with the API')
    .action(async (options) => {
      // Init Config Variables
      initServiceLocation({ location: options.location, config: config });
      config.set('clientKey', options.clientkey);

      await Authenticate(options.clientId, options.clientSecret);
    });

  authCommands
    .command('logout')
    .description('Logout of the API')
    .action(async (options) => {
      globalConfig.clear();
      logline(chalk.green('Successfully Logged Out'));
    });

  authCommands
    .command('status')
    .description('View Authentication/Service Url information')
    .action(async (options) => {
      logline(`Access Token: ${JSON.stringify(globalConfig.get('credentials'), null, 2)}`);
      logline();
      logline(`Service Url: ${globalConfig.get('serviceUrl')}`);
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

export { initAuthCommands };
