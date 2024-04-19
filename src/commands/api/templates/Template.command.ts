import { Command } from 'commander';
import Configstore from 'configstore';
import ora from 'ora';
import { TemplateService } from '../index.js';
import { Template } from './Template.interface.js';

export const initTemplateCommands = (program: Command, config: Configstore) => {
  const templateService = TemplateService(config);

  const templateCommands = program
    .command('templates')
    .option('-t, --type <type>', 'Type of templates to retrieve (Web, Decision, Audience,  etc.)')
    .description('List all Templates')
    .action(async (options) => {
      let initText = 'Retrieving All Templates';
      if (options.type) {
        initText += ` of type ${options.type}`;
      }

      const spinner = ora(initText).start();

      let templates: Template[] | undefined = await templateService.GetAllTemplates(options.type, spinner);
    });

  // Nested (Sub) Commands

  templateCommands
    .command('get')
    .option('--friendlyId <friendlyId>', 'Friendly Id of the template to retrieve')
    //.option('--templateRef <templateRef>', 'Template Reference of the template to retrieve')
    .description('Get a single template')
    .action(async (options) => {
      const spinner = ora(`Retrieving template definition`).start();
      let template: Template | null = null;
      if (options.friendlyId) {
        template = await templateService.GetByFriendlyId(options.friendlyId, spinner);
      }
    });

  templateCommands
    .command('create')
    .requiredOption('-t, --template <template>', 'Template to create')
    .description('Create a new template')
    .action(async (options) => {
      const spinner = ora(`Creating template`).start();
      await templateService.CreateTemplate(options.template, spinner);
    });

  templateCommands
    .command('templates update')
    .requiredOption('-t, --template <template>', 'Template Definition <obj> to update')
    .description('Update a template')
    .action(async (options) => {
      const spinner = ora(`Updating template`).start();
      await templateService.UpdateTemplate(options.template, spinner);
    });
};
