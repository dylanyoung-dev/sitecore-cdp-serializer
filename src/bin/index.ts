#!/usr/bin/env node
import { Command } from 'commander';
import initConfig from '../utils/config.js';
import {
  initAuthCommands,
  initTemplateCommands,
  initOfferCommands
} from '../commands/api/index.js';
import { initDeployCommands } from '../commands/deploy/index.js';

const program = new Command();
const config = initConfig();

program.version('0.1.7');

initAuthCommands(program, config);
initTemplateCommands(program, config);
initOfferCommands(program, config);
initDeployCommands(program, config);

program.parse(process.argv);
