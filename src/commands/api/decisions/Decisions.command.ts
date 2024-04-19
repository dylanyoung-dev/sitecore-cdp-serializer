import { Command } from 'commander';
import Configstore from 'configstore';
import ora from 'ora';
import { DecisionDefinition, DecisionService } from './index.js';

export const initDecisionCommands = (program: Command, config: Configstore) => {
  const decisionService = DecisionService(config);

  const decisionCommands = program
    .command('decisions')
    .description('List all Decisions')
    .action(async (options) => {
      const spinner = ora('Retrieving All Decisions').start();
      await decisionService.GetAllDecisions(spinner);
    });

  // Sub commands
  decisionCommands
    .command('get')
    .requiredOption('-id, --id <id>', 'The decision id to retrieve, either GUID or friendlyId')
    .description('Get a single decision definition')
    .action(async (options) => {
      const spinner = ora(`Retrieving decision ${options.id}`).start();
      let decision: DecisionDefinition | undefined;

      decision = await decisionService.GetDecisionDefinitionById(options.id, spinner);
    });

  decisionCommands
    .command('create')
    .requiredOption('-d, --decision <decision>', 'The decision defintion <object> to create.')
    .description('Create a new decision definition')
    .action(async (options) => {
      const spinner = ora(`Creating decision`).start();
      let decision: DecisionDefinition | undefined;

      await decisionService.CreateDecision(options.decision, spinner);
    });
};
