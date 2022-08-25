import chalk from 'chalk';
import path from 'path';
import { logline } from '../command-helpers.js';
import { checkFolder, getFolderFiles, getFolders } from './helpers.js';
import fs from 'fs';
import { Template, TemplateElement } from '../../commands/api/templates/Template.interface.js';
import Configstore from 'configstore';
import { TemplateService } from '../../commands/api/templates/Template.service.js';
import { stringify } from 'querystring';
import { diffString } from 'json-diff';

const deployTemplates = async (artifactDirectory: string, config: Configstore) => {
  const templateService = TemplateService(config);
  const templateFolder = path.join(artifactDirectory, 'templates');

  logline(chalk.greenBright(`Starting to deploy templates`));

  if (!(await checkFolder(templateFolder))) {
    logline(chalk.red(`Templates folder doesn't exist - will not deploy`));
    return;
  }

  const templateFolderTypes: string[] = await getFolders(templateFolder);

  if (templateFolderTypes.length === 0) {
    logline(chalk.red(`No templates found - will not deploy`));
    return;
  }

  await deployDecisionTemplates(artifactDirectory, config);
  await deployWebTemplates(artifactDirectory, config);

  logline(chalk.greenBright(`Finished deploying templates`));
};

const deployDecisionTemplates = async (artifactDirectory: string, config: Configstore): Promise<void> => {
  const templateService = TemplateService(config);
  const decisionFolder = path.join(artifactDirectory, 'templates', 'decision');
  const clientKey: string = config.get('clientKey');

  logline(chalk.greenBright(`Starting to deploy decision templates`));

  if (!(await checkFolder(decisionFolder))) {
    logline(chalk.red(`Decision templates folder doesn't exist - will not deploy`));
    return;
  }

  const templatesToRun: string[] = await getFolders(decisionFolder);

  if (templatesToRun.length === 0) {
    logline(chalk.red(`No decision templates found - will not deploy`));
  }

  await Promise.all(
    templatesToRun.map(
      async (templateToRun) =>
        await deployIndividualTemplates(templateToRun, decisionFolder, 'DECISION', templateService, clientKey)
    )
  );

  logline(chalk.greenBright(`Finished deploying decision templates`));
};

const deployWebTemplates = async (artifactDirectory: string, config: Configstore): Promise<void> => {
  const templateService = TemplateService(config);
  const decisionFolder = path.join(artifactDirectory, 'templates', 'decision');
  const clientKey: string = config.get('clientKey');

  logline(chalk.greenBright(`Starting to deploy decision templates`));

  if (!(await checkFolder(decisionFolder))) {
    logline(chalk.red(`Decision templates folder doesn't exist - will not deploy`));
    return;
  }

  const templatesToRun: string[] = await getFolders(decisionFolder);

  if (templatesToRun.length === 0) {
    logline(chalk.red(`No decision templates found - will not deploy`));
  }

  await Promise.all(
    templatesToRun.map(
      async (templateToRun) =>
        await deployIndividualTemplates(templateToRun, decisionFolder, 'WEB', templateService, clientKey)
    )
  );

  logline(chalk.greenBright(`Finished deploying decision templates`));
};

const deployIndividualTemplates = async (
  templateToRun: string,
  folderPath: string,
  templateType: string,
  templateService: any,
  clientKey: string
) => {
  const templateFiles = await getFolderFiles(path.join(folderPath, templateToRun));

  // TODO: need a template validation function in the CLI to validate the template
  let template: Template = JSON.parse(
    fs.readFileSync(path.join(folderPath, templateToRun, 'config.json'), 'utf8')
  ) as Template;

  if (template) {
    // Need to make dynamic
    const jsFileContents = await fs.promises.readFile(path.join(folderPath, templateToRun, 'file.js'), 'utf8');

    if (!jsFileContents) {
      logline(chalk.red(`Decision template file missing - Skip Deploy`));
      return;
    }

    // Check to see if this template already exists
    let templateFromService: Template = await templateService.GetByFriendlyId(template.friendlyId);

    logline(chalk.greenBright(`Deploying decision template ${template.friendlyId}`));

    // This needs to be refactored :-)
    if (template.templateElements !== undefined && template.templateElements.length > 0) {
      let objIndexTemplateElement = template.templateElements.findIndex((obj) => obj.id === 'js');

      if (objIndexTemplateElement !== -1) {
        template.templateElements[objIndexTemplateElement].template = jsFileContents;
      } else {
        template.templateElements.push({ id: 'js', template: jsFileContents });
      }
    } else {
      template.templateElements = [];
      template.templateElements.push({ id: 'js', template: jsFileContents });
    }

    let result: Template | null = null;
    if (templateFromService) {
      logline(chalk.greenBright(`Template ${template.friendlyId} already exists in tenant - will update values`));

      let compareTemplate = template;

      compareTemplate.ref = templateFromService.ref;
      compareTemplate.clientKey = templateFromService.clientKey;
      compareTemplate.href = templateFromService.href;
      compareTemplate.modifiedAt = templateFromService.modifiedAt;
      compareTemplate.revision = templateFromService.revision;
      compareTemplate.revisionComment = templateFromService.revisionComment;
      compareTemplate.modifiedByRef = templateFromService.modifiedByRef;

      const jsonMatch = diffString(templateFromService, compareTemplate, { raw: false });

      if (jsonMatch.length > 6) {
        // Differences exist, need to set template to draft and update
        logline(chalk.yellowBright(`Template ${template.friendlyId} has differences - will update`));

        compareTemplate.status = 'DRAFT';

        result = await templateService.UpdateTemplate(compareTemplate);

        if (result) {
          // Now Update
          template.status = 'PUBLISHED';

          result = await templateService.UpdateTemplate(template);
        }
      } else {
        logline(chalk.yellowBright(`No differences found - will not update template`));
      }
    } else {
      logline(chalk.greenBright(`Template ${template.friendlyId} does not exist in the tenant - will create`));

      template.status = 'PUBLISHED';

      result = templateService.CreateTemplate(template);

      if (result != null) {
        logline(chalk.greenBright(`Template ${template.friendlyId} successfully deployed`));
      }
    }
  }
};

export { deployTemplates };
