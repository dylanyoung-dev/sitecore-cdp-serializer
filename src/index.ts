#!/usr/bin/env node
import { Command } from 'commander';
import { version } from '../package.json';
import {
  initAuthCommands,
  initDecisionCommands,
  initOfferCommands,
  initTemplateCommands,
} from './commands/api/index.js';
import { initDeployCommands } from './commands/deploy/index.js';
import { initCommands } from './commands/init/index.js';
import initConfig from './utils/configStore.js';
import { loadConfig } from './utils/personalizeConfig.js';

async function main() {
  const program = new Command();
  const configStore = initConfig();
  const personalizeConfig = await loadConfig();

  program.version(version);

  initCommands(program, configStore);
  initAuthCommands(program, configStore, personalizeConfig);
  initTemplateCommands(program, configStore);
  initDecisionCommands(program, configStore);
  initOfferCommands(program, configStore);
  initDeployCommands(program, configStore, personalizeConfig);

  program.parse(process.argv);
}

main();
