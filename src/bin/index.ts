#!/usr/bin/env node
import { Command } from 'commander';
import initConfig from '../utils/config.js';
import { initAuthCommands, initTemplateCommands } from '../commands/api/index.js';
import { initDeployCommands } from '../commands/deploy/index.js';

const program = new Command();
const config = initConfig();

program.version('1.0.0');

program.addCommand(initAuthCommands(program, config));
initTemplateCommands(program, config);
program.addCommand(initDeployCommands(program, config));

program.parse(process.argv);
