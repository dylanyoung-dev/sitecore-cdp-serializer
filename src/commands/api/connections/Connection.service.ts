import chalk from 'chalk/index.js';
import { Command } from 'commander';
import Configstore from 'configstore';
import { logline } from '../../../utils/index.js';
import { AuthToken } from '../auth/Auth.interface.js';

let globalConfig: Configstore;

const GetAllConnections = async () => {
  const credentials: AuthToken = globalConfig.get('credentials');
  const serviceUrl = globalConfig.get('serviceUrl');

  if (!serviceUrl) {
    logline(chalk.red('Service URL not set, re-run auth command'));
  }

  if (!credentials) {
    logline(chalk.red('You must run the auth command first to initialize the CLI'));
    return;
  }

  let servicePath = `https://${serviceUrl}/v2/connections`;

  const response: Response = await fetch(servicePath, {
    method: 'get',
    body: null,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  });

  if (response.ok) {
  } else {
  }
};

const initConnectionCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const connectionCommands = program
    .command('connections')
    .description('List all Connections')
    .action(async (options) => {
      await GetAllConnections();
    });

  // Nested (Sub) Commands
  connectionCommands
    .command('get')
    .option('--connectionRef <connectionRef>', 'Connection Reference')
    .action(async (options) => {});
};

export { initConnectionCommands };
