import Configstore from 'configstore';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { AuthToken } from '../auth/Auth.interface.js';
import { Command } from 'commander';
import { Template } from './Template.interface.js';
import { logline } from '../../../utils/index.js';

let globalConfig: Configstore;

const GetAllTemplates = async (templateType: string) => {
  const credentials: AuthToken = globalConfig.get('credentials');
  const serviceUrl = globalConfig.get('serviceUrl');

  if (!serviceUrl) {
    logline(chalk.red('Service URL not set, re-run auth command'));
  }

  if (!credentials) {
    logline(chalk.red('You must run the auth command first to initialize the CLI'));
    return;
  }

  let servicePath = `https://${serviceUrl}/v3/templates`;

  const response: Response = await fetch(servicePath, {
    method: 'get',
    body: null,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  });

  if (response.ok) {
    console.log('success');
    logline(await response.json());
  } else {
    console.log(chalk.red('Failed to retrieve templates'));
  }
};

const GetByFriendlyId = async (friendlyId: string): Promise<Template | null> => {
  const credentials: AuthToken = globalConfig.get('credentials');
  const serviceUrl = globalConfig.get('serviceUrl');

  let servicePath = `https://${serviceUrl}/v3/templates/${friendlyId}`;

  const response: Response = await fetch(servicePath, {
    method: 'get',
    body: null,
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
    },
  });

  if (response.ok) {
    const result = await response.json();

    logline(chalk.green('Template retrieved successfully'));

    return result as Template;
  } else {
    logline(chalk.red('Failed to retrieve template'));
    return null;
  }
};

const CreateTemplate = async (template: Template) => {
  const credentials: AuthToken = globalConfig.get('credentials');
  const serviceUrl = globalConfig.get('serviceUrl');

  let servicePath = `https://${serviceUrl}/v3/templates`;

  const response: Response = await fetch(servicePath, {
    method: 'post',
    body: JSON.stringify(template),
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    logline(chalk.green('Template created successfully'));
  } else {
    logline(chalk.red('Failed to create template'));
  }
};

const UpdateTemplate = async (template: Template) => {};

const initTemplateCommands = (program: Command, config: Configstore) => {
  globalConfig = config;

  const templateCommands = program
    .command('templates')
    .option('-t, --type <type>', 'Type of templates to retrieve (Web, Decision, Audience,  etc.)')
    .description('List all Templates')
    .action(async (options) => {
      await GetAllTemplates(options.templateType);
    });

  // Nested (Sub) Commands

  templateCommands
    .command('get')
    .option('--friendlyId <friendlyId>', 'Friendly Id of the template to retrieve')
    .description('Get a single template')
    .action(async (options) => {
      await GetByFriendlyId(options.friendlyId);
    });

  templateCommands
    .command('create')
    .requiredOption('-t, --template <template>', 'Template to create')
    .description('Create a new template')
    .action(async (options) => {
      await CreateTemplate(options.template);
    });

  templateCommands
    .command('templates update')
    .requiredOption('-t, --template <template>', 'Template to update')
    .description('Update a template')
    .action(async (options) => {
      await UpdateTemplate(options.template);
    });
};

export { initTemplateCommands };
