import Configstore from 'configstore';
import { Response } from 'node-fetch';
import { Command } from 'commander';
import { Template } from './Template.interface.js';
import {
  logline,
  logSuccess,
  logError,
  logResponse,
} from '../../../utils/index.js';
import { BaseService } from '../Base.service.js'

const TemplateService = (config: Configstore) => {
  const baseService = BaseService(config);
  
  const GetAllTemplates = async (templateType: string) => {
    try {
      const response: Response = await baseService.Get('v3/templates');
  
      if (response.ok) {
        logSuccess('success');
        let templates: Template[] = (await response.json()) as Template[];
  
        return templates;
      } else {
        logResponse(response, 'Failed to retrieve templates');
      }
    } catch (ex) {
      logError(ex);
    }
  };

  const GetByFriendlyId = async (friendlyId: string): Promise<Template | null> => {
    try {
      const response: Response = await baseService.Get(`v3/templates/${friendlyId}`);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;
        logSuccess('Template retrieved successfully');

        return result;
      } else {
        logResponse(response, 'Failed to retrieve template');
        return null;
      }
    } catch (ex) {
      logError(ex);
    }

    return null;
  };

  const CreateTemplate = async (template: Template): Promise<Template | null> => {

    try {
      const response: Response = await baseService.Post('v3/templates', []);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;

        return result;
      } else {
        logResponse(response, 'Failed to create template');
        return null;
      }
    } catch (ex) {
      logError(ex);
    }
    
    return null;
  };

  const UpdateTemplate = async (template: Template): Promise<Template | null> => {
    try {
      const response: Response = await baseService.Put(`v3/templates/${template.ref}`, template);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;

        return result;
      } else {
        logResponse(response, 'Failed to update template');
        return null;
      }
    } catch (ex) {
      logError(ex);
    }

    return null;
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
