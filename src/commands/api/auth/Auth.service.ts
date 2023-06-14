import Configstore from 'configstore';
import { AuthToken } from './Auth.interface.js';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { Command } from 'commander';
import { initServiceLocation, logline, logSuccess, logError } from '../../../utils/index.js';

let globalConfig: Configstore;

export const Authenticate = async (
  clientId: string,
  clientSecret: string,
  isCloudPortal: boolean,
  isStaging: boolean
) => {
  const authUrl = globalConfig.get('authUrl');

  if (!authUrl) {
    logline(chalk.red('Auth URL not set, re-run auth command'));
  }

  // Authentication is completely different for Cloud Portal
  if (isCloudPortal) {
    await HandleCloudPortalAuthentication(clientId, clientSecret, authUrl, isStaging);
  } else {
    await HandleBoxeverAuthentication(clientId, clientSecret, authUrl);
  }
};

const HandleCloudPortalAuthentication = async (
  clientId: string,
  clientSecret: string,
  authUrl: string,
  isStaging: boolean
) => {
  const servicePath = `https://${authUrl}/oauth/token`;

  const params = new URLSearchParams();

  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('audience', 'https://api.sitecorecloud.io');

  const response: Response = await fetch(servicePath, {
    method: 'post',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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

const HandleBoxeverAuthentication = async (clientId: string, clientSecret: string, authUrl: string) => {
  const servicePath = `https://${authUrl}/v2/oauth/token`;

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

const initAuthCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const authCommands = program.command('auth');

  authCommands
    .command('login')
    .requiredOption('-id, --clientId <clientId>', 'Client Id (Client Key)')
    .requiredOption('-s, --clientSecret <clientSecret>', 'Client Secret (API Token)')
    .option('-c, --cloudPortal', 'Add if you want to use Cloud Portal features')
    .option('-l, --location <location>', 'Service Location (EU, US, AP)', 'EU')
    .option('--staging', 'Add if you want to use Cloud Portal Staging (uncommon)')
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

      await Authenticate(
        options.clientId,
        options.clientSecret,
        options.cloudPortal ?? false,
        options.staging ?? false
      );
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
