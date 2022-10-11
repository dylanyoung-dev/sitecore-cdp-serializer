import Configstore from 'configstore';
import fetch, { Response } from 'node-fetch';
import chalk from 'chalk';
import { AuthToken } from '../auth/Auth.interface.js';
import { Command } from 'commander';
import { Template } from './Template.interface.js';
import { logline } from '../../../utils/index.js';

const TemplateService = (config: Configstore) => {
  const serviceUrl = config.get('serviceUrl');
  const credentials: AuthToken = config.get('credentials');

  const GetAllTemplates = async (templateType: string) => {
    if (!serviceUrl) {
      logline(chalk.red('Service URL not set, re-run auth command'));
      return;
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
      logline(chalk.green('success'));
      let templates: Template[] = (await response.json()) as Template[];

      return templates;
    } else {
      console.log(chalk.red('Failed to retrieve templates'));
    }
  };

  const GetOfferTemplates = async () => {};

  const GetByFriendlyId = async (friendlyId: string): Promise<Template | null> => {
    if (!serviceUrl) {
      logline(chalk.red('Service URL not set, re-run auth command'));
      return null;
    }

    if (!credentials) {
      logline(chalk.red('You must run the auth command first to initialize the CLI'));
      return null;
    }

    let servicePath = `https://${serviceUrl}/v3/templates/${friendlyId}`;

    const response: Response = await fetch(servicePath, {
      method: 'get',
      body: null,
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
      },
    });

    if (response.ok) {
      const result: Template = (await response.json()) as Template;

      logline(chalk.green('Template retrieved successfully'));

      return result;
    } else {
      logline(chalk.red('Failed to retrieve template'));
      return null;
    }
  };

  const CreateTemplate = async (template: Template): Promise<Template | null> => {
    if (!serviceUrl) {
      logline(chalk.red('Service URL not set, re-run auth command'));
      return null;
    }

    if (!credentials) {
      logline(chalk.red('You must run the auth command first to initialize the CLI'));
      return null;
    }

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
      const result: Template = (await response.json()) as Template;

      return result;
    } else {
      logline(chalk.red('Failed to create template'));
      logline(JSON.stringify(await response.json()));
      return null;
    }
  };

  const UpdateTemplate = async (template: Template): Promise<Template | null> => {
    if (!serviceUrl) {
      logline(chalk.red('Service URL not set, re-run auth command'));
      return null;
    }

    if (!credentials) {
      logline(chalk.red('You must run the auth command first to initialize the CLI'));
      return null;
    }

    let servicePath = `https://${serviceUrl}/v3/templates/${template.ref}`;

    const response: Response = await fetch(servicePath, {
      method: 'put',
      body: JSON.stringify(template),
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result: Template = (await response.json()) as Template;

      return result;
    } else {
      logline(chalk.red('Failed to update template'));
      logline(JSON.stringify(await response.json()));
      return null;
    }
  };

  return {
    GetAllTemplates,
    GetByFriendlyId,
    CreateTemplate,
    UpdateTemplate,
  };
};

const initTemplateCommands = (program: Command, config: Configstore) => {
  const templateService = TemplateService(config);

  const templateCommands = program
    .command('templates')
    .option('-t, --type <type>', 'Type of templates to retrieve (Web, Decision, Audience,  etc.)')
    .description('List all Templates')
    .action(async (options) => {
      let templates: Template[] | undefined = await templateService.GetAllTemplates(options.templateType);

      if (templates) {
        logline(JSON.stringify(templates, null, 2));
      }
    });

  // Nested (Sub) Commands

  templateCommands
    .command('get')
    .option('--friendlyId <friendlyId>', 'Friendly Id of the template to retrieve')
    .option('--templateRef <templateRef>', 'Template Reference of the template to retrieve')
    .description('Get a single template')
    .action(async (options) => {
      let template: Template | null = null;
      if (options.friendlyId) {
        template = await templateService.GetByFriendlyId(options.friendlyId);
      }

      if (template !== null) {
        logline(JSON.stringify(template, null, 2));
      }
    });

  templateCommands
    .command('create')
    .requiredOption('-t, --template <template>', 'Template to create')
    .description('Create a new template')
    .action(async (options) => {
      await templateService.CreateTemplate(options.template);
    });

  templateCommands
    .command('templates update')
    .requiredOption('-t, --template <template>', 'Template to update')
    .description('Update a template')
    .action(async (options) => {
      await templateService.UpdateTemplate(options.template);
    });
};

export { initTemplateCommands, TemplateService };
