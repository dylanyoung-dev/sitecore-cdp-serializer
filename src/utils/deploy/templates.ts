import chalk from 'chalk';
import path from 'path';
import { logline } from '../command-helpers.js';
import { getConfigFile } from '../io.js';
import { checkFolder, getFolderFiles, getFolders } from './helpers.js';
import fs from 'fs';
import { Template, TemplateElement } from '../../commands/api/templates/Template.interface.js';
import Configstore from 'configstore';
import { TemplateService } from '../../commands/api/templates/Template.service.js';
import { diffString } from 'json-diff';

const deployAllTemplates = async (artifactDirectory: string, config: Configstore) => {
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

  await deployGenericTemplates(artifactDirectory, 'DECISION', config);
  await deployGenericTemplates(artifactDirectory, 'WEB', config);
  await deployOfferTemplates(artifactDirectory, config);

  logline(chalk.greenBright(`Finished deploying templates`));
};

const deployOfferTemplates = async (artifactDirectory: string, config: Configstore): Promise<void> => {
  const templateService = TemplateService(config);
  const templateFolder = path.join(artifactDirectory, 'templates', 'offer-templates');

  logline(chalk.greenBright(`Starting to deploy Offer templates`));

  if (!(await checkFolder(templateFolder))) {
    logline(chalk.redBright(`Offer templates folder doesn't exist - will skip`));
    return;
  }

  const templatesToRun: string[] = await getFolders(templateFolder);

  if (templatesToRun.length === 0) {
    logline(chalk.redBright(`No offer templates found - will not deploy`));
    return;
  }

  await Promise.all(
    templatesToRun.map(async (template) => {
      await deployOfferTemplate(template, templateFolder, templateService);
    })
  );
};

const deployGenericTemplates = async (
  artifactDirectory: string,
  templateType: string,
  config: Configstore
): Promise<void> => {
  const templateService = TemplateService(config);
  const templateFolder = path.join(artifactDirectory, 'templates', templateType.toLowerCase());

  logline(chalk.greenBright(`Starting to deploy ${templateType} templates`));

  if (!(await checkFolder(templateFolder))) {
    logline(chalk.red(`${templateType} templates folder doesn't exist - will not deploy`));
    return;
  }

  const templatesToRun: string[] = await getFolders(templateFolder);

  if (templatesToRun.length === 0) {
    logline(chalk.red(`No ${templateType} templates found - will not deploy`));
    return;
  }

  await Promise.all(
    templatesToRun.map(
      async (template) => await deployGenericTemplate(template, templateFolder, templateType, templateService)
    )
  );

  logline(chalk.greenBright(`Finished deploying ${templateType} templates`));
};

const deployGenericTemplate = async (
  templateToRun: string,
  folderPath: string,
  templateType: string,
  templateService: any
) => {
  let template: Template | null = await getConfigFile(path.join(folderPath, templateToRun));

  if (template != null) {
    let result: Template | null = null;

    const templateFromService: Template = await templateService.GetByFriendlyId(template.friendlyId);

    template = generateTemplateElements(template, path.join(folderPath, templateToRun));

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

const generateTemplateElements = (template: Template, startDirectory: string): Template => {
  const files = fs.readdirSync(startDirectory);

  if (!files) {
    return template;
  }

  const filenames: string[] = files.filter((value) => value.match(/file.(js|html|css|ftl)/));

  if (filenames.length > 0) {
    // If empty array, then initialize
    if (template.templateElements == undefined || template.templateElements.length == 0) {
      template.templateElements = [];
    }

    filenames.forEach((file, item) => {
      let fileContents = fs.readFileSync(path.join(startDirectory, file), 'utf8');
      let extension = file.split('.').pop();

      if (extension == 'ftl') {
        extension = 'freemarker';
      }

      if (fileContents && extension) {
        let existingElement = template.templateElements.findIndex((element) => element.id == extension);

        if (existingElement > -1) {
          template.templateElements[existingElement].template = fileContents;
        } else {
          template.templateElements.push({ id: extension, template: fileContents });
        }
      } else {
        logline(`There was an issue attaching file ${file} to ${template.name}`);
      }
    });
  }

  return template;
};

export { deployAllTemplates, deployGenericTemplates, deployOfferTemplates };
