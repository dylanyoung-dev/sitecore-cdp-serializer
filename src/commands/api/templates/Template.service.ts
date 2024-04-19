import Configstore from 'configstore';
import { Response } from 'node-fetch';
import { Ora } from 'ora';
import { logError } from '../../../utils/index.js';
import { BaseService } from '../Base.service.js';
import { Template } from './Template.interface.js';

export const TemplateService = (config: Configstore) => {
  const baseService = BaseService(config);

  const GetAllTemplates = async (templateType: string, spinner: Ora) => {
    try {
      let serviceUrl = 'v3/templates';

      if (templateType) {
        serviceUrl += `?type=${templateType.toUpperCase()}`;
      }

      const response: Response = await baseService.Get(serviceUrl);

      if (response.ok) {
        let templates: Template[] = (await response.json()) as Template[];

        spinner.succeed(`Templates retrieved successfully\n\n${JSON.stringify(templates, null, 2)}`);

        return templates;
      } else {
        spinner.fail('Failed to retrieve templates');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve templates with error: ${ex}`);
    }
  };

  const GetByFriendlyId = async (friendlyId: string, spinner: Ora): Promise<Template | null> => {
    try {
      const response: Response = await baseService.Get(`v3/templates/${friendlyId}`);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;

        spinner.succeed(`Template retrieved successfully\n\n${JSON.stringify(result, null, 2)}`);

        return result;
      } else {
        spinner.fail('Failed to retrieve template');
      }
    } catch (ex) {
      spinner.fail(`Failed to retrieve template with error: ${ex}`);
    }

    return null;
  };

  const CreateTemplate = async (template: Template, spinner: Ora): Promise<Template | null> => {
    try {
      const response: Response = await baseService.Post('v3/templates', template);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;

        spinner.succeed(`Template created successfully\n\n${JSON.stringify(result, null, 2)}`);

        return result;
      } else {
        spinner.fail('Failed to create template');
        return null;
      }
    } catch (ex) {
      spinner.fail(`Failed to create template with error: ${ex}`);
      logError(ex);
    }

    return null;
  };

  const UpdateTemplate = async (template: Template, spinner: Ora): Promise<Template | null> => {
    try {
      const response: Response = await baseService.Put(`v3/templates/${template.ref}`, template);

      if (response.ok) {
        const result: Template = (await response.json()) as Template;

        spinner.succeed('Template updated successfully');

        return result;
      } else {
        spinner.fail('Failed to update template');
        return null;
      }
    } catch (ex) {
      spinner.fail(`Failed to update template with error: ${ex}`);
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
