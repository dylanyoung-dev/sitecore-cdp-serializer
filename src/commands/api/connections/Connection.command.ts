import { Command } from 'commander';
import Configstore from 'configstore';
import ora from 'ora';
import { ConnectionService } from './Connection.service.js';

export const initConnectionCommands = (program: Command, config: Configstore) => {
  const connectionService = ConnectionService(config);

  const connectionCommands = program
    .command('connections')
    .description('List all Connections')
    .action(async () => {
      const spinner = ora('Retrieving All Connections').start();
      await connectionService.GetAllConnections(spinner);
    });

  // Nested (Sub) Commands
  connectionCommands
    .command('get')
    .option('--connectionRef <connectionRef>', 'Connection Reference')
    .action(async (options) => {
      const spinner = ora('Retrieving Connection').start();
      await connectionService.GetConnectionByRef(options.connectionRef, spinner);
    });
};
