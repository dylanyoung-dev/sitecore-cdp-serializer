#!/usr/bin/env node
import { Command } from 'commander';
import initConfig from '../Common/config.js';
import { initServiceLocation } from '../Common/serviceLocation.js';
import { Authenticate } from '../Services/Auth/Auth.service.js';
import { GetAllTemplates } from '../Services/Templates/Template.service.js';

const program = new Command();
const config = initConfig();

program.version('1.0.0');

program
  .command('auth')
  .requiredOption('-u, --username <username>', 'Username')
  .requiredOption('-p, --password <password>', 'Password')
  .option('-l, --location <location>', 'Service Location (EU, US, APJ)', 'EU')
  .description('Authenticate with the API')
  .action(async (options) => {
    // Set the service location
    initServiceLocation({ location: options.location, config: config });

    await Authenticate({ username: options.username, password: options.password, config: config });
  });

program
  .command('templates')
  .option('-t, --type <type>', 'Type of templates to retrieve (Web, Decision, Audience,  etc.)')
  .description('List all Templates')
  .action(async (options) => {
    await GetAllTemplates({ templateType: options.templateType, config: config });
  });

program
  .command('templates')
  .option('--friendlyId <friendlyId>', 'Friendly Id of the template to retrieve')
  .description('Get a single template')
  .action(async (options) => {});

program.parse(process.argv);
