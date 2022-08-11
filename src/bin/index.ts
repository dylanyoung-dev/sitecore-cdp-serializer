#!/usr/bin/env node
import { Command } from 'commander';
import initConfig from '../utils/config.js';
import { initServiceLocation } from '../utils/serviceLocation.js';
import { initAuthCommands, initTemplateCommands } from '../commands/api/index.js';
import { initDeployCommands } from '../commands/deploy/index.js';

const program = new Command();
const config = initConfig();

program.version('1.0.0');

initAuthCommands(program, config);
initTemplateCommands(program, config);
initDeployCommands(program, config);

program.parse(process.argv);
