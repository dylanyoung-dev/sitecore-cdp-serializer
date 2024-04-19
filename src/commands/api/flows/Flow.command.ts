import { Command } from 'commander';
import Configstore from 'configstore';
import ora from 'ora';
import { FlowService } from './Flow.service.js';

export const initFlowCommands = (program: Command, config: Configstore) => {
  const flowService = FlowService(config);

  const flowCommands = program
    .command('flows')
    .description('List all Flows')
    .action(async () => {
      const spinner = ora('Retrieving All Flows').start();
      await flowService.GetAllFlows(spinner);
    });

  // Nested (Sub) Commands
  flowCommands
    .command('get')
    .option('--flowRef <flowRef>', 'Flow Reference')
    .action(async (options) => {
      const spinner = ora('Retrieving Flow').start();
      await flowService.GetFlow(options.flowRef, spinner);
    });
};
