import Configstore from 'configstore';
import { AuthToken } from './Auth.interface.js';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { Command } from 'commander';
import { initServiceLocation, log, logline } from '../../../utils/index.js';

let globalConfig: Configstore;

const Authenticate = async (username: string, password: string) => {
  const serviceUrl = globalConfig.get('serviceUrl');

  if (!serviceUrl) {
    logline(chalk.red('Service URL not set, re-run auth command'));
  }

  const servicePath = `https://${serviceUrl}/v2/oauth/token`;

  const params = new URLSearchParams();

  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  logline(chalk.green('Authenticating...'));

  const response: Response = await fetch(servicePath, {
    method: 'post',
    body: params,
  });

  if (response.ok) {
    let authToken: AuthToken | null = await (response.json() as Promise<AuthToken>);

    logline(chalk.green('Successfully Authenticated'));

    if (authToken) {
      globalConfig.set('credentials', authToken);

      logline(chalk.green('Token Stored for future uses'));
    }
  } else {
    logline(chalk.red('Authentication Failed'));
  }
};

const initAuthCommands = (program: Command, config: Configstore) => {
  program
    .command('auth')
    .requiredOption('-u, --username <username>', 'Username')
    .requiredOption('-p, --password <password>', 'Password')
    .option('-l, --location <location>', 'Service Location (EU, US, APJ)', 'EU')
    .description('Authenticate with the API')
    .action(async (options) => {
      // Set the service location
      initServiceLocation({ location: options.location, config: config });

      await Authenticate(options.username, options.password);
    });
};

export { initAuthCommands };
